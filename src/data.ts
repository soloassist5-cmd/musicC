import raw from './generated/data.json';

export type WordStyle = 'solid' | 'outline' | 'underline' | 'glitch' | 'speed' | 'typewriter' | 'accent' | 'wall';
export type Word = {i: number; text: string; line: number; style: WordStyle; start: number; end: number};
export type Scene = {kind: string; line: number; start: number; firstWord: number; opt: Record<string, string>};
export type Data = {
	fps: number;
	startTime: number;
	duration: number;
	durationInFrames: number;
	bpm: number;
	title: string;
	artist: string;
	lines: string[];
	scenes: Scene[];
	words: Word[];
	rms: number[];
};

export const DATA = raw as Data;

export type Timeline = {
	t: number; // seconds since video start (frozen after end)
	frame: number;
	word: Word | null; // current word
	wordIdx: number;
	sinceWord: number; // seconds since current word start
	line: number; // -1 = intro
	lineStart: number;
	lineEnd: number;
	sinceLine: number;
	wordInLine: number;
	lineWords: Word[];
	frozen: boolean;
};

export const freezeTime = () => {
	const last = DATA.words[DATA.words.length - 1];
	return Math.min(DATA.duration - 1 / DATA.fps, last.end + 0.45);
};

export function timelineAt(rawFrame: number): Timeline {
	const fps = DATA.fps;
	const fz = freezeTime();
	const t0 = rawFrame / fps;
	const frozen = t0 > fz;
	const t = Math.min(t0, fz);
	const frame = Math.round(t * fps);
	const ws = DATA.words;
	let wi = -1;
	for (let k = 0; k < ws.length; k++) if (ws[k].start <= t + 1e-6) wi = k;
	const word = wi >= 0 ? ws[wi] : null;
	const line = word ? word.line : -1;
	const lineWords = ws.filter((w) => w.line === line);
	const lineStart = lineWords.length ? lineWords[0].start : 0;
	const next = ws.find((w) => w.line === line + 1);
	const lineEnd = next ? next.start : DATA.duration;
	return {
		t,
		frame,
		word,
		wordIdx: wi,
		sinceWord: word ? t - word.start : t,
		line,
		lineStart,
		lineEnd,
		sinceLine: t - lineStart,
		wordInLine: word ? lineWords.indexOf(word) : -1,
		lineWords,
		frozen,
	};
}
