import React from 'react';
import {C, MONO, SAFE, W} from './theme';
import {DATA, Timeline} from './data';

const pad = (n: number) => String(n).padStart(2, '0');

const Corner: React.FC<{x: number; y: number; sx: number; sy: number}> = ({x, y, sx, sy}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: 64,
			height: 64,
			transform: `scale(${sx},${sy})`,
			transformOrigin: '0 0',
			borderLeft: `6px solid ${C.black}`,
			borderTop: `6px solid ${C.black}`,
		}}
	/>
);

const label: React.CSSProperties = {
	position: 'absolute',
	fontFamily: MONO,
	fontWeight: 700,
	fontSize: 30,
	letterSpacing: 2,
	color: C.black,
	whiteSpace: 'nowrap',
};

// readable chip behind HUD labels when a full-frame wall is under them
const chip = (on?: boolean): React.CSSProperties => (on ? {background: C.bg, padding: '4px 10px', margin: '-4px -10px'} : {});

export const Hud: React.FC<{tl: Timeline; onWall?: boolean}> = ({tl, onWall}) => {
	const fps = DATA.fps;
	const total = Math.floor(tl.t * fps);
	const ff = total % fps;
	const s = Math.floor(total / fps);
	const tc = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
	const recOn = tl.t % 1 < 0.5;
	const lineNo = Math.max(0, tl.line) + 1;
	const progress = Math.min(1, tl.t / DATA.duration);
	const L = SAFE.left - 24;
	const R = SAFE.right + 24;
	const T = SAFE.top - 8;
	const B = SAFE.bottom + 8;
	return (
		<div style={{position: 'absolute', inset: 0}}>
			<Corner x={L} y={T} sx={1} sy={1} />
			<Corner x={R} y={T} sx={-1} sy={1} />
			<Corner x={L} y={B} sx={1} sy={-1} />
			<Corner x={R} y={B} sx={-1} sy={-1} />
			<div style={{...label, left: SAFE.left + 30, top: SAFE.top + 30, display: 'flex', alignItems: 'center', gap: 14, ...chip(onWall)}}>
				MADK1D
				<span
					style={{
						width: 22,
						height: 22,
						borderRadius: 11,
						background: C.red,
						opacity: recOn ? 1 : 0.15,
						display: 'inline-block',
					}}
				/>
				<span style={{color: C.red}}>REC</span>
			</div>
			<div style={{...label, right: W - SAFE.right + 30, top: SAFE.top + 30, ...chip(onWall)}}>{tc}</div>
			<div
				style={{
					position: 'absolute',
					left: SAFE.left + 30,
					right: W - SAFE.right + 30,
					top: SAFE.bottom - 92,
					height: 4,
					background: 'rgba(0,0,0,0.12)',
				}}
			>
				<div style={{width: `${progress * 100}%`, height: '100%', background: C.black}} />
				<div
					style={{
						position: 'absolute',
						left: `${progress * 100}%`,
						top: -7,
						width: 4,
						height: 18,
						background: C.red,
					}}
				/>
			</div>
			<div style={{...label, left: SAFE.left + 30, top: SAFE.bottom - 72, ...chip(onWall)}}>
				LINE {pad(lineNo)}/{pad(DATA.lines.length)}
			</div>
			<div style={{...label, right: W - SAFE.right + 30, top: SAFE.bottom - 72, ...chip(onWall)}}>
				BPM <span style={{color: C.red}}>{DATA.bpm}</span>
			</div>
		</div>
	);
};
