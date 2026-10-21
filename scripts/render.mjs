// full render: output/perestan_silent.mp4 (no audio) + output/perestan_preview.mp4 (with demo audio)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {renderMedia} from '@remotion/renderer';
import {buildData, BASE, OUT} from './build-data.mjs';
import {ROOT, prepare, browserExecutable} from './remotion.mjs';

const cfg = JSON.parse(fs.readFileSync(path.join(BASE, 'config.json'), 'utf8'));
const data = buildData();
console.log(`segment: start ${data.startTime}s, duration ${data.duration}s (${data.durationInFrames} frames @ ${data.fps})`);
const {serveUrl, composition} = await prepare();

// render in short chunks (a long single browser session occasionally hangs), each retried, then concat
const CHUNK = 150;
const chunkDir = path.join(ROOT, 'build/chunks');
fs.rmSync(chunkDir, {recursive: true, force: true});
fs.mkdirSync(chunkDir, {recursive: true});
const parts = [];
for (let a = 0; a < data.durationInFrames; a += CHUNK) {
	const b = Math.min(a + CHUNK, data.durationInFrames) - 1;
	const file = path.join(chunkDir, `part_${String(a).padStart(5, '0')}.mp4`);
	for (let attempt = 1; ; attempt++) {
		try {
			await renderMedia({
				serveUrl,
				composition,
				codec: 'h264',
				crf: 8,
				pixelFormat: 'yuv420p',
				muted: true,
				frameRange: [a, b],
				// one tab: with 2 tabs the background one sometimes stops running page JS and the chunk times out
				concurrency: 1,
				timeoutInMilliseconds: 60000,
				outputLocation: file,
				browserExecutable,
			});
			break;
		} catch (e) {
			if (attempt >= 3) throw e;
			console.log(`chunk ${a}-${b} failed (${String(e.message).slice(0, 80)}), retry ${attempt}`);
		}
	}
	parts.push(file);
	console.log(`render ${Math.round(((b + 1) / data.durationInFrames) * 100)}%`);
}
const list = path.join(chunkDir, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
const raw = path.join(ROOT, 'build/raw.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', raw], {stdio: 'inherit'});

const out = (f) => path.join(OUT, f);
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], {stdio: 'inherit'});
// re-encode once so the profile/level/faststart are exactly what TikTok likes
ff(['-i', raw, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(cfg.crf ?? 15),
	'-pix_fmt', 'yuv420p', '-r', String(data.fps), '-movflags', '+faststart', out(`${cfg.slug ?? 'perestan'}_silent.mp4`)]);
const audio = path.join(BASE, 'input/demo.mp3');
if (fs.existsSync(audio)) {
	ff(['-i', out(`${cfg.slug ?? 'perestan'}_silent.mp4`), '-ss', String(data.startTime), '-t', String(data.duration), '-i', audio,
		'-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out(`${cfg.slug ?? 'perestan'}_preview.mp4`)]);
} else {
	console.log('no input/demo.mp3 — preview with sound skipped');
}
console.log(`done: ${out(`${cfg.slug ?? 'perestan'}_silent.mp4`)}`);
