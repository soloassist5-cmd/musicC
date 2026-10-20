import React from 'react';
import {Easing, interpolate} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import {C, FONT, H, MONO, rand, SAFE, SAFE_W, W} from './theme';
import {Timeline, Word} from './data';

const MAX_W = SAFE_W * 0.9;
const MAX_SIZE = 230;
export const WORD_TOP = SAFE.top + 200;

const upper = (s: string) => s.toLocaleUpperCase('ru-RU');

export const fitSize = (text: string, extra = 0) => {
	const {width} = measureText({text, fontFamily: 'Inter', fontWeight: '900', fontSize: 100, letterSpacing: '-0.02em'});
	return Math.min(MAX_SIZE, Math.floor((100 * (MAX_W - extra)) / Math.max(1, width)));
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const baseText = (size: number): React.CSSProperties => ({
	fontFamily: FONT,
	fontWeight: 900,
	fontSize: size,
	lineHeight: 1,
	letterSpacing: '-0.02em',
	whiteSpace: 'nowrap',
});

const StyledWord: React.FC<{w: Word; s: number}> = ({w, s}) => {
	const text = upper(w.text);
	switch (w.style) {
		case 'outline': {
			const size = fitSize(text);
			return <div style={{...baseText(size), color: 'transparent', WebkitTextStroke: `${Math.max(3, size / 45)}px ${C.black}`}}>{text}</div>;
		}
		case 'underline': {
			const size = fitSize(text);
			const g = interpolate(s, [0.04, 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
			return (
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{...baseText(size), color: C.black}}>{text}</div>
					<div
						style={{
							height: Math.max(12, size * 0.11),
							marginTop: size * 0.06,
							background: C.red,
							transform: `scaleX(${g})`,
							transformOrigin: 'left',
						}}
					/>
				</div>
			);
		}
		case 'glitch': {
			const size = fitSize(text);
			const active = s < 0.3;
			const f = Math.floor(s * 60);
			const bands = 7;
			if (!active) return <div style={{...baseText(size), color: C.black}}>{text}</div>;
			const amp = interpolate(s, [0, 0.3], [38, 4], clamp);
			return (
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{...baseText(size), color: C.black, opacity: 0}}>{text}</div>
					{[C.red, C.blue].map((col, k) => (
						<div
							key={col}
							style={{
								...baseText(size),
								position: 'absolute',
								left: (k ? -1 : 1) * amp * 0.5 * (0.5 + rand(f * 3 + k)),
								top: 0,
								color: col,
								mixBlendMode: 'multiply',
								opacity: 0.9,
							}}
						>
							{text}
						</div>
					))}
					{Array.from({length: bands}).map((_, b) => {
						const top = (b / bands) * 100;
						const bottom = 100 - ((b + 1) / bands) * 100;
						const dx = (rand(f * 17 + b * 5) - 0.5) * amp * (rand(f + b) > 0.4 ? 2 : 0.3);
						return (
							<div
								key={b}
								style={{
									...baseText(size),
									position: 'absolute',
									left: dx,
									top: 0,
									color: C.black,
									clipPath: `inset(${top}% -20% ${bottom}% -20%)`,
								}}
							>
								{text}
							</div>
						);
					})}
				</div>
			);
		}
		case 'speed': {
			const size = fitSize(text);
			const lines = 9;
			return (
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{...baseText(size), color: C.black}}>{text}</div>
					{Array.from({length: lines}).map((_, k) => {
						const y = size * (0.08 + (k / lines) * 0.42);
						const len = 0.35 + rand(k * 7 + w.i) * 0.65;
						const shift = interpolate(s, [0, 0.4], [1, 0], {...clamp, easing: Easing.out(Easing.quad)});
						return (
							<div
								key={k}
								style={{
									position: 'absolute',
									top: y,
									left: `${-25 - shift * 60 + rand(k + 3) * 30}%`,
									width: `${len * 110}%`,
									height: Math.max(3, size * 0.022),
									background: C.bg,
								}}
							/>
						);
					})}
					{Array.from({length: 5}).map((_, k) => (
						<div
							key={`m${k}`}
							style={{
								position: 'absolute',
								top: size * (0.12 + k * 0.08),
								right: '102%',
								width: 60 + rand(k + w.i * 3) * 160,
								height: 5,
								background: C.black,
								opacity: interpolate(s, [0, 0.5], [0.9, 0.25], clamp),
							}}
						/>
					))}
				</div>
			);
		}
		case 'typewriter': {
			const size = fitSize(text + '_', 56);
			const dur = Math.min(0.4, Math.max(0.12, (w.end - w.start) * 0.7));
			const n = Math.ceil(interpolate(s, [0, dur], [0, text.length], clamp));
			const cursor = Math.floor(s / 0.25) % 2 === 0;
			return (
				<div style={{display: 'inline-block', background: C.black, padding: '16px 28px 20px'}}>
					<div style={{...baseText(size), color: '#fff', position: 'relative'}}>
						<span style={{opacity: 0}}>{text}_</span>
						<span style={{position: 'absolute', left: 0, top: 0}}>
							{text.slice(0, n)}
							<span style={{color: C.red, opacity: cursor ? 1 : 0}}>_</span>
						</span>
					</div>
				</div>
			);
		}
		case 'accent': {
			const size = fitSize(text, 64);
			const g = interpolate(s, [0, 0.14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
			return (
				<div style={{position: 'relative', display: 'inline-block', padding: '18px 32px 24px'}}>
					<div style={{position: 'absolute', inset: 0, background: C.red, transform: `scaleX(${g})`, transformOrigin: 'left'}} />
					<div style={{...baseText(size), color: '#fff', position: 'relative', clipPath: `inset(-10% ${(1 - g) * 100}% -10% -10%)`}}>{text}</div>
				</div>
			);
		}
		default: {
			const size = fitSize(text);
			return <div style={{...baseText(size), color: C.black}}>{text}</div>;
		}
	}
};

// small caps of already sung words in the current line
const SungLine: React.FC<{tl: Timeline}> = ({tl}) => {
	const sung = tl.lineWords.slice(0, Math.max(0, tl.wordInLine));
	const txt = sung.map((w) => upper(w.text)).join(' ');
	// keep only the tail if it gets long
	const words = txt.split(' ');
	let shown = txt;
	let size = 40;
	while (measureText({text: shown, fontFamily: 'Inter', fontWeight: '800', fontSize: size, letterSpacing: '0.04em'}).width > MAX_W && words.length) {
		words.shift();
		shown = '… ' + words.join(' ');
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: SAFE.left + 30,
				top: WORD_TOP - 70,
				fontFamily: FONT,
				fontWeight: 800,
				fontSize: size,
				letterSpacing: '0.04em',
				color: 'rgba(0,0,0,0.5)',
				whiteSpace: 'nowrap',
			}}
		>
			{sung.length ? shown : ''}
		</div>
	);
};

export const CurrentWord: React.FC<{tl: Timeline}> = ({tl}) => {
	const w = tl.word;
	if (!w || w.style === 'wall') return w ? <SungLine tl={tl} /> : null;
	const s = tl.sinceWord;
	const p = interpolate(s, [0, 0.18], [0, 1], clamp);
	const scale = interpolate(p, [0, 1], [1.14, 1], {easing: Easing.out(Easing.back(2.2))});
	const y = interpolate(p, [0, 1], [25, 0], {easing: Easing.out(Easing.cubic)});
	const op = interpolate(s, [0, 0.05], [0, 1], clamp);
	return (
		<>
			<SungLine tl={tl} />
			<div
				style={{
					position: 'absolute',
					left: SAFE.left + 30,
					top: WORD_TOP,
					transform: `translateY(${y}px) scale(${scale})`,
					transformOrigin: 'left center',
					opacity: op,
				}}
			>
				<StyledWord w={w} s={s} />
			</div>
		</>
	);
};

// full-frame wall of running rows
export const Wall: React.FC<{w: Word; s: number}> = ({w, s}) => {
	const text = upper(w.text);
	const rowH = 168;
	const rows = Math.ceil(H / rowH) + 1;
	const unit = `${text} • `;
	const size = 150;
	const uw = measureText({text: unit, fontFamily: 'Inter', fontWeight: '900', fontSize: size, letterSpacing: '-0.02em'}).width;
	const reps = Math.ceil((W * 2) / uw) + 2;
	const bgIn = interpolate(s, [0, 0.08], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', inset: 0, background: `rgba(238,236,231,${0.96 * bgIn})`, overflow: 'hidden'}}>
			{Array.from({length: rows}).map((_, r) => {
				const delay = r * 0.025;
				const a = interpolate(s, [delay, delay + 0.1], [0, 1], clamp);
				const dir = r % 2 === 0 ? -1 : 1;
				const speed = 340 + (r % 3) * 80;
				const x = ((dir * s * speed) % uw) - uw + (r * 137) % uw * 0.3;
				const kind = r % 3;
				return (
					<div
						key={r}
						style={{
							position: 'absolute',
							top: r * rowH - 20,
							left: x,
							...baseText(size),
							opacity: a,
							transform: `translateY(${(1 - a) * -30}px)`,
							color: kind === 0 ? C.black : kind === 1 ? 'transparent' : C.red,
							WebkitTextStroke: kind === 1 ? `4px ${C.black}` : undefined,
						}}
					>
						{unit.repeat(reps)}
					</div>
				);
			})}
		</div>
	);
};

export const monoLabel: React.CSSProperties = {fontFamily: MONO, fontWeight: 700};
