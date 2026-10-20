// public/fonts/*.woff2 -> src/generated/fonts.ts (base64), so render tabs never fetch fonts over the network
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './remotion.mjs';

const dir = path.join(ROOT, 'public/fonts');
const entries = fs
	.readdirSync(dir)
	.filter((f) => f.endsWith('.woff2'))
	.map((f) => `\t${JSON.stringify(f.replace('.woff2', ''))}: ${JSON.stringify(fs.readFileSync(path.join(dir, f)).toString('base64'))},`);
fs.mkdirSync(path.join(ROOT, 'src/generated'), {recursive: true});
fs.writeFileSync(path.join(ROOT, 'src/generated/fonts.ts'), `export const FONT_DATA: Record<string, string> = {\n${entries.join('\n')}\n};\n`);
console.log('embedded', entries.length, 'fonts');
