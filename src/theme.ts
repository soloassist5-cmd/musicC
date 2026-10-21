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
const faces = Object.entries(FONT_DATA).map(([name, data]) => {
	const m = name.match(/^(inter|jetbrains-mono)-(latin-ext|latin|cyrillic)-(\d+)-normal$/)!;
	const face = new FontFace(FAMILIES[m[1]], b64(data), {weight: m[3], unicodeRange: RANGES[m[2]]});
	document.fonts.add(face);
	return face;
});
// face.load() occasionally never settles inside a render tab: cap the wait, then check the faces directly
Promise.race([Promise.all(faces.map((f) => f.load())), new Promise((r) => setTimeout(r, 3000))])
	.catch((e) => console.error('font load failed', e))
	.finally(() => {
		const bad = faces.filter((f) => f.status !== 'loaded');
		if (bad.length) console.error('fonts not loaded:', bad.map((f) => `${f.family} ${f.weight} ${f.status}`).join(', '));
		continueRender(fontHandle);
	});

export const C = {
	ink: '#0B0B10',
	sub: '#8E8E93',
	line: '#E5E5EA',
	fill: '#F2F2F7',
	card: '#FFFFFF',
	blue: '#0A84FF',
	green: '#34C759',
	red: '#FF3B30',
	orange: '#FF9F0A',
	purple: '#AF52DE',
	pink: '#FF5FA2',
};

// marker colors for highlighted words, cycled per line
export const MARKERS = ['#FFE45C', '#FF9ACB', '#B9F46B', '#9CCBFF'];
export const CONFETTI = ['#FF5FA2', '#0A84FF', '#FFD60A', '#34C759', '#AF52DE', '#FF9F0A', '#5AC8FA'];

export const FONT = "'Inter', sans-serif";
export const MONO = "'JetBrains Mono', monospace";

// TikTok safe zone (px)
export const W = 1080;
export const H = 1920;
export const SAFE = {left: 72, top: 160, right: W - 160, bottom: H - 480};
export const SAFE_W = SAFE.right - SAFE.left;
export const SAFE_CX = (SAFE.left + SAFE.right) / 2;

export const shadow = '0 40px 90px rgba(70,40,140,0.20), 0 8px 24px rgba(20,10,60,0.08)';

// deterministic pseudo-random in [0,1)
export const rand = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
