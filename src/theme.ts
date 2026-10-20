import {continueRender, delayRender} from 'remotion';
import {FONT_DATA} from './generated/fonts';

// fonts are embedded as base64 (scripts/embed-fonts.mjs): no network fetch inside render tabs
const RANGES: Record<string, string> = {
	latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
	'latin-ext': 'U+0100-02AF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
	cyrillic: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
};
const FAMILIES: Record<string, string> = {inter: 'Inter', 'jetbrains-mono': 'JetBrains Mono'};

const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)).buffer;

const fontHandle = delayRender('fonts');
Promise.all(
	Object.entries(FONT_DATA).map(([name, data]) => {
		const m = name.match(/^(inter|jetbrains-mono)-(latin-ext|latin|cyrillic)-(\d+)-normal$/)!;
		const face = new FontFace(FAMILIES[m[1]], b64(data), {weight: m[3], unicodeRange: RANGES[m[2]]});
		document.fonts.add(face);
		return face.load();
	}),
)
	.catch((e) => console.error('font load failed', e))
	.finally(() => continueRender(fontHandle));

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
