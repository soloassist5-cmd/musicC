// timings.json + audio.json + config.json -> src/generated/data.json, output/START_TIME.txt
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// TRACK=name -> tracks/<name>/ and output/<name>/ ; empty -> project root and output/
export const TRACK = process.env.TRACK || '';
export const BASE = TRACK ? path.join(ROOT, 'tracks', TRACK) : ROOT;
export const OUT = TRACK ? path.join(ROOT, 'output', TRACK) : path.join(ROOT, 'output');
const read = (f) => JSON.parse(fs.readFileSync(path.join(BASE, f), 'utf8'));

const embedFonts = () => execFileSync(process.execPath, [path.join(ROOT, 'scripts/embed-fonts.mjs')], {stdio: 'inherit'});

export const STYLES = ['solid', 'outline', 'underline', 'glitch', 'speed', 'typewriter'];
export const SCENES = ['alert', 'family', 'map', 'call', 'game', 'storage', 'timer', 'wallet'];

const hash = (n) => {
	let x = (n + 1) * 2654435761;
	x = ((x >>> 16) ^ x) * 0x45d9f3b;
	x = ((x >>> 16) ^ x) >>> 0;
	return x;
};

export function buildData() {
	embedFonts();
	const cfg = read('config.json');
	const timings = read('timings.json');
	const audio = read('audio.json');
	const fps = cfg.fps;
	const off = (cfg.offset_ms || 0) / 1000;
	const lines = fs
		.readFileSync(path.join(BASE, 'input/lyrics.txt'), 'utf8')
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);

	const first = timings[0].start + off;
	const last = timings[timings.length - 1].end + off;
	const startTime = Math.max(0, first - cfg.lead_in);
	const endTime = Math.min(audio.duration, last + cfg.tail);
	const durationInFrames = Math.round((endTime - startTime) * fps);

	let prev = '';
	const words = timings.map((w, i) => {
		let style = w.mark === 'accent' ? 'accent' : w.mark === 'wall' ? 'wall' : null;
		if (!style) {
			let h = hash(i);
			style = STYLES[h % STYLES.length];
			if (style === prev) style = STYLES[(h + 1 + (h >> 8) % (STYLES.length - 1)) % STYLES.length];
		}
		if (cfg.style_overrides?.[String(i)]) style = cfg.style_overrides[String(i)];
		prev = style;
		return {
			i,
			text: w.text.replace(/[«»"()]/g, '').replace(/[,.!?…:;]+$/u, ''),
			line: w.line,
			style,
			// seconds relative to video start
			start: +(w.start + off - startTime).toFixed(3),
			end: +(w.end + off - startTime).toFixed(3),
		};
	});

	// scene plan: [line, wordInLine, kind] -> absolute start times; lines without a plan cycle through SCENES
	const plan = (cfg.scene_plan ?? []).map(([line, wi, kind, opt]) => ({line, wi, kind, opt}));
	lines.forEach((_, li) => {
		if (!plan.some((p) => p.line === li)) plan.push({line: li, wi: 0, kind: SCENES[li % SCENES.length]});
	});
	const scenes = plan
		.map(({line, wi, kind, opt}) => {
			const lw = words.filter((w) => w.line === line);
			const w = lw[Math.min(wi, lw.length - 1)];
			return {kind, line, start: w ? w.start : 0, firstWord: w ? w.i : 0, opt: opt ?? {}};
		})
		.sort((a, b) => a.start - b.start);
	const f0 = Math.round(startTime * 60);
	const rms = [];
	for (let f = 0; f < durationInFrames; f++) {
		rms.push(audio.rms60[f0 + Math.round((f * 60) / fps)] ?? 0);
	}

	const data = {
		fps,
		startTime: +startTime.toFixed(3),
		duration: +(durationInFrames / fps).toFixed(3),
		durationInFrames,
		bpm: audio.bpm,
		title: cfg.title ?? 'ПЕРЕСТАНЬ',
		artist: cfg.artist ?? 'MADK1D',
		lines,
		scenes,
		words,
		rms,
	};
	fs.mkdirSync(path.join(ROOT, 'src/generated'), {recursive: true});
	fs.writeFileSync(path.join(ROOT, 'src/generated/data.json'), JSON.stringify(data));
	fs.mkdirSync(OUT, {recursive: true});
	fs.writeFileSync(
		path.join(OUT, 'START_TIME.txt'),
		`start_in_track_s=${data.startTime.toFixed(3)}\nduration_s=${data.duration.toFixed(3)}\noffset_ms=${cfg.offset_ms}\n`,
	);
	return data;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const d = buildData();
	console.log(`start ${d.startTime}s, duration ${d.duration}s, ${d.durationInFrames} frames, ${d.words.length} words, BPM ${d.bpm}`);
}
