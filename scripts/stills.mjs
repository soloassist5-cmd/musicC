// one frame from the middle of every line -> output/contact_sheet.png
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {renderStill} from '@remotion/renderer';
import {buildData} from './build-data.mjs';
import {ROOT, prepare, browserExecutable} from './remotion.mjs';

const data = buildData();
const {serveUrl, composition} = await prepare();
const dir = path.join(ROOT, 'build/stills');
fs.mkdirSync(dir, {recursive: true});

// optional explicit frames: node scripts/stills.mjs 120 480
const extra = process.argv.slice(2).map(Number);
const frames = extra.length
	? extra
	: data.lines.map((_, li) => {
			const ws = data.words.filter((w) => w.line === li);
			const end = data.words.find((w) => w.line === li + 1)?.start ?? data.duration;
			return Math.round(((ws[0].start + end) / 2) * data.fps);
		});
const files = [];
for (const [k, frame] of frames.entries()) {
	const out = path.join(dir, `still_${String(k).padStart(2, '0')}_f${frame}.png`);
	await renderStill({serveUrl, composition, frame, output: out, browserExecutable});
	files.push(out);
	console.log('still', frame);
}
if (!extra.length) {
	const cols = 4;
	const rows = Math.ceil(files.length / cols);
	execFileSync('ffmpeg', [
		'-v', 'error', '-y',
		...files.flatMap((f) => ['-i', f]),
		'-filter_complex',
		files.map((_, i) => `[${i}]scale=540:960,drawbox=t=2:c=black@0.3[s${i}]`).join(';') +
			';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` +
			files.map((_, i) => `${(i % cols) * 540}_${Math.floor(i / cols) * 960}`).join('|') + `:fill=white`,
		path.join(ROOT, 'output/contact_sheet.png'),
	]);
	console.log('output/contact_sheet.png', rows, 'rows');
}
