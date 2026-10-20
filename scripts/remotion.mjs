// shared Remotion helpers: bundle once, pick a local Chromium if Remotion's own is not downloaded
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const browserExecutable = (() => {
	const candidates = [
		process.env.REMOTION_BROWSER,
		'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
	].filter(Boolean);
	return candidates.find((p) => fs.existsSync(p)) ?? null;
})();

export async function prepare() {
	const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src/index.ts')});
	const composition = await selectComposition({serveUrl, id: 'Perestan', browserExecutable});
	return {serveUrl, composition};
}
