// full render: output/perestan_silent.mp4 (no audio) + output/perestan_preview.mp4 (with demo audio)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {renderMedia} from '@remotion/renderer';
import {buildData} from './build-data.mjs';
import {ROOT, prepare, browserExecutable} from './remotion.mjs';

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
const data = buildData();
console.log(`segment: start ${data.startTime}s, duration ${data.duration}s (${data.durationInFrames} frames @ ${data.fps})`);
const {serveUrl, composition} = await prepare();

const raw = path.join(ROOT, 'build/raw.mp4');
let last = -1;
await renderMedia({
	serveUrl,
	composition,
	codec: 'h264',
	crf: cfg.crf ?? 15,
	pixelFormat: 'yuv420p',
	x264Preset: 'slow',
	muted: true,
	concurrency: 2,
	timeoutInMilliseconds: 120000,
	outputLocation: raw,
	browserExecutable,
	onProgress: ({progress}) => {
		const p = Math.floor(progress * 20);
		if (p !== last) console.log(`render ${Math.round(progress * 100)}%`), (last = p);
	},
});

const out = (f) => path.join(ROOT, 'output', f);
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], {stdio: 'inherit'});
// re-encode once so the profile/level/faststart are exactly what TikTok likes
ff(['-i', raw, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(cfg.crf ?? 15),
	'-pix_fmt', 'yuv420p', '-r', String(data.fps), '-movflags', '+faststart', out('perestan_silent.mp4')]);
ff(['-i', out('perestan_silent.mp4'), '-ss', String(data.startTime), '-t', String(data.duration), '-i', path.join(ROOT, 'input/demo.mp3'),
	'-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out('perestan_preview.mp4')]);
console.log('done: output/perestan_silent.mp4, output/perestan_preview.mp4');
