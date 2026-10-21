import React from 'react';
import {Easing, interpolate} from 'remotion';
import {C, FONT, MONO, shadow} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const outCubic = Easing.out(Easing.cubic);
export const outBack = Easing.out(Easing.back(1.8));

// 0..1 over [a, b] seconds
export const ramp = (s: number, a: number, b: number, easing = outCubic) => interpolate(s, [a, b], [0, 1], {...clamp, easing});

export type SceneProps = {
	s: number; // seconds since scene start
	dur: number; // scene duration
	p: number; // 0..1 progress
	t: number; // global time
	frame: number;
	sinceWord: number;
	wi: number; // index of current word inside the scene
	word: string;
	rms: (back?: number) => number;
	opt: Record<string, string>;
};

export const Card: React.FC<{w?: number; h?: number; x?: number; y?: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
	w = 780,
	h,
	x,
	y = 0,
	r = 48,
	style,
	children,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x ?? 496 - w / 2,
			top: y,
			width: w,
			height: h,
			background: C.card,
			borderRadius: r,
			boxShadow: shadow,
			overflow: 'hidden',
			...style,
		}}
	>
		{children}
	</div>
);

export const T: React.FC<{s?: number; w?: number; c?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({s = 34, w = 700, c = C.ink, style, children}) => (
	<span style={{fontFamily: FONT, fontSize: s, fontWeight: w, color: c, whiteSpace: 'nowrap', letterSpacing: '-0.01em', ...style}}>{children}</span>
);

export const M: React.FC<{s?: number; c?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({s = 22, c = C.sub, style, children}) => (
	<span style={{fontFamily: MONO, fontSize: s, fontWeight: 500, color: c, whiteSpace: 'nowrap', ...style}}>{children}</span>
);

export const Abs: React.FC<{x?: number; y?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({x = 0, y = 0, style, children}) => (
	<div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);

export const Row: React.FC<{gap?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({gap = 16, style, children}) => (
	<div style={{display: 'flex', alignItems: 'center', gap, ...style}}>{children}</div>
);

export const Col: React.FC<{gap?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({gap = 6, style, children}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap, ...style}}>{children}</div>
);

// app-icon style rounded square
export const Icon: React.FC<{size?: number; bg: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({size = 72, bg, children, style}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size * 0.26,
			background: bg,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#fff',
			fontFamily: FONT,
			fontWeight: 800,
			fontSize: size * 0.5,
			flexShrink: 0,
			...style,
		}}
	>
		{children}
	</div>
);

export const Avatar: React.FC<{size?: number; bg?: string; letter?: string; dark?: boolean; style?: React.CSSProperties}> = ({size = 80, bg, letter, dark, style}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size / 2,
			background: bg ?? (dark ? 'linear-gradient(160deg,#3a3a44,#111)' : 'linear-gradient(160deg,#D9DCE6,#B8BDCB)'),
			position: 'relative',
			overflow: 'hidden',
			flexShrink: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...style,
		}}
	>
		{letter ? (
			<span style={{fontFamily: FONT, fontWeight: 800, fontSize: size * 0.46, color: '#fff'}}>{letter}</span>
		) : (
			<svg viewBox="0 0 100 100" width={size} height={size} style={{position: 'absolute', inset: 0}}>
				<circle cx="50" cy="40" r="17" fill="rgba(255,255,255,0.9)" />
				<path d="M16 96 C20 68 80 68 84 96 Z" fill="rgba(255,255,255,0.9)" />
			</svg>
		)}
	</div>
);

export const Pill: React.FC<{bg: string; c?: string; s?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({bg, c = '#fff', s = 30, style, children}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 10,
			padding: `${s * 0.45}px ${s * 0.9}px`,
			borderRadius: 999,
			background: bg,
			color: c,
			fontFamily: FONT,
			fontWeight: 700,
			fontSize: s,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);

export const Bar: React.FC<{w: number; h?: number; v: number; c?: string; bg?: string}> = ({w, h = 14, v, c = C.blue, bg = C.fill}) => (
	<div style={{width: w, height: h, borderRadius: h / 2, background: bg, overflow: 'hidden'}}>
		<div style={{width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: '100%', borderRadius: h / 2, background: c}} />
	</div>
);

export const Check: React.FC<{size?: number; c?: string; p?: number}> = ({size = 120, c = C.green, p = 1}) => (
	<svg viewBox="0 0 100 100" width={size} height={size}>
		<circle cx="50" cy="50" r="46" fill={c} transform={`scale(${p})`} style={{transformOrigin: '50px 50px'}} />
		<path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - Math.max(0, (p - 0.4) / 0.6))} />
	</svg>
);

export const Waveform: React.FC<{bars: number; w: number; h: number; rms: (back?: number) => number; c?: string; played?: number; c2?: string}> = ({
	bars,
	w,
	h,
	rms,
	c = C.red,
	played = 1,
	c2 = '#F5B5B1',
}) => (
	<div style={{width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
		{Array.from({length: bars}).map((_, k) => {
			const v = rms((bars - k) * 2);
			return (
				<div
					key={k}
					style={{
						width: Math.max(3, (w / bars) * 0.55),
						height: Math.max(6, v * h * (0.55 + 0.45 * Math.abs(Math.sin(k * 1.9)))),
						borderRadius: 4,
						background: k / bars <= played ? c : c2,
					}}
				/>
			);
		})}
	</div>
);
