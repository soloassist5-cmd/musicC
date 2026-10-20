import React from 'react';
import {interpolate} from 'remotion';
import {C, cardStyle, FONT, MONO} from '../theme';
import {Timeline} from '../data';

export type SceneProps = {tl: Timeline; rms: number[]};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const lineProgress = (tl: Timeline) =>
	interpolate(tl.sinceLine, [0, Math.max(0.1, tl.lineEnd - tl.lineStart)], [0, 1], clamp);

// small bump on every new word
export const pulse = (tl: Timeline, amt = 0.04) => 1 + amt * Math.exp(-tl.sinceWord * 12) * (tl.sinceWord >= 0 ? 1 : 0);

export const upper = (s: string) => s.toLocaleUpperCase('ru-RU');

export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => (
	<div style={{...cardStyle, position: 'absolute', ...style}}>{children}</div>
);

export const Avatar: React.FC<{size: number; dark?: boolean; me?: boolean; style?: React.CSSProperties}> = ({size, dark, me, style}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size / 2,
			background: me ? `linear-gradient(135deg, ${C.black} 0%, #3a3a3a 100%)` : dark ? '#1a1a1a' : C.soft,
			border: `3px solid ${me ? C.black : C.border}`,
			position: 'relative',
			overflow: 'hidden',
			flexShrink: 0,
			...style,
		}}
	>
		{me ? (
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: size * 0.42,
					color: '#fff',
				}}
			>
				m<span style={{color: C.red}}>.</span>
			</div>
		) : (
			<svg viewBox="0 0 100 100" width={size} height={size} style={{position: 'absolute', inset: 0}}>
				<circle cx="50" cy="38" r="17" fill={dark ? '#555' : '#A9A59C'} />
				<path d="M18 92 C22 66 78 66 82 92 Z" fill={dark ? '#555' : '#A9A59C'} />
			</svg>
		)}
	</div>
);

export const Mono: React.FC<{size?: number; color?: string; weight?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
	size = 24,
	color = C.muted,
	weight = 700,
	style,
	children,
}) => <span style={{fontFamily: MONO, fontWeight: weight, fontSize: size, color, letterSpacing: 1, whiteSpace: 'nowrap', ...style}}>{children}</span>;

export const Txt: React.FC<{size?: number; color?: string; weight?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
	size = 36,
	color = C.black,
	weight = 800,
	style,
	children,
}) => <span style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', ...style}}>{children}</span>;

// blueprint-style footnote: red dot at (x,y), leader line to label
export const FigNote: React.FC<{x: number; y: number; dx: number; dy: number; n: number; text: string; p: number}> = ({x, y, dx, dy, n, text, p}) => {
	const len = Math.hypot(dx, dy);
	const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
	const draw = interpolate(p, [0, 1], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: 0, top: 0}}>
			<div style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: C.red, transform: `scale(${draw > 0 ? 1 : 0})`}} />
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y - 1.5,
					width: len * draw,
					height: 3,
					background: C.red,
					transform: `rotate(${ang}deg)`,
					transformOrigin: '0 50%',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: x + dx + (dx >= 0 ? 12 : -12),
					top: y + dy - 22,
					transform: dx < 0 ? 'translateX(-100%)' : undefined,
					opacity: interpolate(p, [0.6, 1], [0, 1], clamp),
					display: 'flex',
					flexDirection: 'column',
					alignItems: dx < 0 ? 'flex-end' : 'flex-start',
					gap: 2,
				}}
			>
				<Mono size={24} color={C.red}>fig.0{n}</Mono>
				<Mono size={22} color={C.black} weight={500}>{text}</Mono>
			</div>
		</div>
	);
};

export const Pill: React.FC<{bg: string; color?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({bg, color = '#fff', style, children}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 10,
			padding: '12px 22px',
			borderRadius: 999,
			background: bg,
			color,
			fontFamily: FONT,
			fontWeight: 800,
			fontSize: 30,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);
