import {continueRender, delayRender, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// local woff2 files (public/fonts) so every render tab gets Cyrillic glyphs without a network fetch
const RANGES: Record<string, string> = {
	latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
	'latin-ext': 'U+0100-02AF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
	cyrillic: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
};
const FILES: [string, string, string, string][] = [
	['Inter', 'inter', '800', 'latin'],
	['Inter', 'inter', '900', 'latin'],
	['Inter', 'inter', '800', 'latin-ext'],
	['Inter', 'inter', '900', 'latin-ext'],
	['Inter', 'inter', '800', 'cyrillic'],
	['Inter', 'inter', '900', 'cyrillic'],
	['JetBrains Mono', 'jetbrains-mono', '500', 'latin'],
	['JetBrains Mono', 'jetbrains-mono', '700', 'latin'],
	['JetBrains Mono', 'jetbrains-mono', '500', 'cyrillic'],
	['JetBrains Mono', 'jetbrains-mono', '700', 'cyrillic'],
];
const fontHandle = delayRender('fonts');
Promise.all(
	FILES.map(([family, file, weight, subset]) =>
		loadFont({
			family,
			url: staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`),
			weight,
			unicodeRange: RANGES[subset],
		}),
	),
).then(() => continueRender(fontHandle));

export const C = {
	bg: '#EEECE7',
	black: '#000000',
	red: '#E3242B',
	blue: '#1F6FFF',
	card: '#FBFAF7',
	border: '#D8D5CE',
	green: '#17A55B',
	muted: '#8C8880',
	soft: '#E4E1DA',
};

export const FONT = "'Inter', sans-serif";
export const MONO = "'JetBrains Mono', monospace";

// TikTok safe zone (px)
export const W = 1080;
export const H = 1920;
export const SAFE = {left: 72, top: 160, right: W - 160, bottom: H - 480};
export const SAFE_W = SAFE.right - SAFE.left;
export const SAFE_CX = (SAFE.left + SAFE.right) / 2;

export const shadow = '0 18px 40px rgba(40,34,24,0.10), 0 2px 6px rgba(40,34,24,0.06)';

export const cardStyle: React.CSSProperties = {
	background: C.card,
	border: `2px solid ${C.border}`,
	borderRadius: 28,
	boxShadow: shadow,
};

// deterministic pseudo-random in [0,1)
export const rand = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
