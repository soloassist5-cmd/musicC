import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import {C, CONFETTI, FONT, H, MARKERS, MONO, rand, SAFE, SAFE_W, W} from '../theme';
import {DATA, Timeline, timelineAt, Word} from '../data';
import {clamp, outBack, outCubic, ramp, SceneProps} from './ui';
import {CONFETTI_AT as BASE_CONFETTI, SCENES as BASE_SCENES} from './scenes';
import {DYN_CONFETTI, DYN_SCENES} from './scenes_dyn';
import {RN_CONFETTI, RN_SCENES} from './scenes_rn';

const SCENES = {...BASE_SCENES, ...DYN_SCENES, ...RN_SCENES};
const CONFETTI_AT: Record<string, number> = {...BASE_CONFETTI, ...DYN_CONFETTI, ...RN_CONFETTI};

const fps = DATA.fps;
const STAGE_TOP = 660;
const TEXT_TOP = 250;
const TEXT_W = SAFE_W - 40;
const TEXT_MAX_H = 360;

/* ---------- background ---------- */

const BLOBS = [
	{c: '#FFC2DF', x: 0.1, y: 0.15, r: 620},
	{c: '#BFD8FF', x: 0.9, y: 0.25, r: 680},
	{c: '#FFF2A6', x: 0.2, y: 0.7, r: 640},
	{c: '#C9F6DA', x: 0.85, y: 0.8, r: 600},
	{c: '#E3CCFF', x: 0.5, y: 0.45, r: 560},
];

const Shape: React.FC<{k: number; t: number}> = ({k, t}) => {
	const kind = k % 5;
	const size = 50 + rand(k * 3) * 60;
	const x = rand(k * 7 + 1) * W;
	const y = ((rand(k * 11 + 2) * H - t * (12 + rand(k) * 18)) % H + H) % H;
	const rot = t * (rand(k + 5) - 0.5) * 40 + k * 30;
	const stroke = 'rgba(30,20,60,0.13)';
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`}}>
			{kind === 0 && <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="6" />}
			{kind === 1 && <path d="M50 8 L92 88 L8 88 Z" fill="none" stroke={stroke} strokeWidth="6" strokeLinejoin="round" />}
			{kind === 2 && <rect x="12" y="12" width="76" height="76" rx="14" fill="none" stroke={stroke} strokeWidth="6" />}
			{kind === 3 && <path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" fill="none" stroke={stroke} strokeWidth="6" strokeLinejoin="round" />}
			{kind === 4 && <path d="M50 14 V86 M14 50 H86" stroke={stroke} strokeWidth="8" strokeLinecap="round" />}
		</svg>
	);
};

const Background: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{background: '#F7F3FB', overflow: 'hidden'}}>
		{BLOBS.map((b, k) => {
			// soft radial gradient instead of filter: blur() — same look, far cheaper to rasterize without a GPU
			const r = b.r * 1.6;
			return (
				<div
					key={k}
					style={{
						position: 'absolute',
						left: b.x * W - r / 2 + Math.sin(t * 0.5 + k * 2) * 90,
						top: b.y * H - r / 2 + Math.cos(t * 0.4 + k) * 110,
						width: r,
						height: r,
						background: `radial-gradient(circle, ${b.c} 0%, ${b.c}cc 28%, ${b.c}00 70%)`,
					}}
				/>
			);
		})}
		{Array.from({length: 16}).map((_, k) => (
			<Shape key={k} k={k} t={t} />
		))}
	</AbsoluteFill>
);

/* ---------- HUD ---------- */

const pad = (n: number) => String(n).padStart(2, '0');

const Hud: React.FC<{tl: Timeline; scene: number}> = ({tl, scene}) => {
	const total = Math.floor(tl.t * fps);
	const s = Math.floor(total / fps);
	const tc = `${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(total % fps)}`;
	const progress = Math.min(1, tl.t / DATA.duration);
	const txt: React.CSSProperties = {position: 'absolute', fontFamily: MONO, fontWeight: 500, fontSize: 22, color: 'rgba(20,14,40,0.62)', whiteSpace: 'nowrap', letterSpacing: 1};
	const ticks = 70;
	const rulerY = SAFE.bottom - 70;
	return (
		<>
			<div style={{...txt, left: SAFE.left, top: SAFE.top + 10}}>
				{DATA.artist} // {DATA.title} // DEMO · SC {pad(scene + 1)}/{pad(DATA.scenes.length)}
			</div>
			<div style={{...txt, right: W - SAFE.right, top: SAFE.top + 10}}>
				<span style={{color: C.red, opacity: tl.t % 1 < 0.5 ? 1 : 0.25}}>●</span> REC {tc}
			</div>
			<div style={{position: 'absolute', left: SAFE.left, top: rulerY, width: SAFE_W, height: 30}}>
				{Array.from({length: ticks + 1}).map((_, k) => (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: (k / ticks) * SAFE_W,
							bottom: 0,
							width: 2,
							height: k % 5 === 0 ? 22 : 11,
							background: k / ticks <= progress ? 'rgba(20,14,40,0.7)' : 'rgba(20,14,40,0.22)',
						}}
					/>
				))}
				<div style={{position: 'absolute', left: progress * SAFE_W - 2, bottom: -6, width: 4, height: 40, borderRadius: 2, background: C.red}} />
			</div>
			<div style={{...txt, left: SAFE.left, top: rulerY + 44}}>LINE {pad(Math.max(0, tl.line) + 1)}/{pad(DATA.lines.length)}</div>
			<div style={{...txt, right: W - SAFE.right, top: rulerY + 44}}>BPM {DATA.bpm || '—'}</div>
		</>
	);
};

/* ---------- phrase text: the line builds up word by word ---------- */

type Placed = {w: Word; x: number; y: number; width: number};

const layoutCache = new Map<number, {size: number; placed: Placed[]}>();

const layoutLine = (line: number) => {
	const hit = layoutCache.get(line);
	if (hit) return hit;
	const words = DATA.words.filter((w) => w.line === line);
	let res = {size: 40, placed: [] as Placed[]};
	for (let size = 104; size >= 40; size -= 4) {
		const lh = size * 1.18;
		const space = size * 0.28;
		const pads = size * 0.16;
		let x = 0;
		let y = 0;
		const placed: Placed[] = [];
		for (const w of words) {
			const width = measureText({text: w.text, fontFamily: 'Inter', fontWeight: '800', fontSize: size, letterSpacing: '-0.025em'}).width + (hl(w) ? pads * 2 : 0);
			if (x > 0 && x + width > TEXT_W) {
				x = 0;
				y += lh;
			}
			placed.push({w, x, y, width});
			x += width + space;
		}
		res = {size, placed};
		if (y + lh <= TEXT_MAX_H) break;
	}
	layoutCache.set(line, res);
	return res;
};

const hl = (w: Word) => w.style === 'accent' || w.style === 'wall' || w.text.includes(' ');

const Phrase: React.FC<{tl: Timeline; line: number; out?: number}> = ({tl, line, out = 0}) => {
	const {size, placed} = layoutLine(line);
	const marker = MARKERS[line % MARKERS.length];
	return (
		<div style={{position: 'absolute', left: SAFE.left, top: TEXT_TOP, opacity: 1 - out, filter: out ? `blur(${out * 18}px)` : undefined, transform: `translateY(${-out * 30}px)`}}>
			{placed.map(({w, x, y, width}) => {
				const s = tl.t - w.start;
				if (s < 0 && !out) return null;
				if (out && w.start > tl.t) return null;
				const a = ramp(s, 0, 0.16);
				const blur = interpolate(s, [0, 0.16], [16, 0], clamp);
				const sc = interpolate(s, [0, 0.2], [1.14, 1], {...clamp, easing: outBack});
				const isHl = hl(w);
				const g = ramp(s, 0.02, 0.18);
				const pads = size * 0.16;
				return (
					<div key={w.i} style={{position: 'absolute', left: x, top: y, width, height: size * 1.18}}>
						{isHl && (
							<div
								style={{
									position: 'absolute',
									left: 0,
									top: size * 0.12,
									width,
									height: size * 1.0,
									background: w.style === 'accent' ? C.ink : marker,
									borderRadius: size * 0.14,
									transform: `scaleX(${g}) rotate(-1.2deg)`,
									transformOrigin: 'left center',
								}}
							/>
						)}
						<div
							style={{
								position: 'absolute',
								left: isHl ? pads : 0,
								top: 0,
								fontFamily: FONT,
								fontWeight: 800,
								fontSize: size,
								lineHeight: 1.18,
								letterSpacing: '-0.025em',
								whiteSpace: 'nowrap',
								color: w.style === 'accent' ? '#fff' : C.ink,
								opacity: a,
								filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
								transform: `translateY(${(1 - a) * 26}px) scale(${sc})`,
								transformOrigin: 'left bottom',
							}}
						>
							{w.text}
						</div>
					</div>
				);
			})}
		</div>
	);
};

/* ---------- confetti ---------- */

type Burst = {t: number; x: number; y: number; n: number; seed: number};

const BURSTS: Burst[] = (() => {
	const b: Burst[] = [];
	DATA.words.forEach((w) => {
		if (w.style === 'accent') b.push({t: w.start, x: 500, y: 420, n: 70, seed: w.i});
	});
	DATA.scenes.forEach((sc, k) => {
		const at = CONFETTI_AT[sc.kind];
		if (at === undefined) return;
		const end = DATA.scenes[k + 1]?.start ?? DATA.duration;
		b.push({t: sc.start + (end - sc.start) * at, x: 496, y: 1000, n: 90, seed: 100 + k});
	});
	return b;
})();

const Confetti: React.FC<{t: number}> = ({t}) => (
	<>
		{BURSTS.map((b, bi) => {
			const s = t - b.t;
			if (s < 0 || s > 2.4) return null;
			return Array.from({length: b.n}).map((_, k) => {
				const r = (q: number) => rand(b.seed * 131 + k * 7 + q);
				const ang = -Math.PI / 2 + (r(1) - 0.5) * Math.PI * 1.5;
				const v = 900 + r(2) * 1300;
				const drag = 1 - Math.exp(-s * 2.6);
				const x = b.x + (Math.cos(ang) * v * drag) / 2.6 + Math.sin(s * 6 + k) * 20;
				const y = b.y + (Math.sin(ang) * v * drag) / 2.6 + 420 * s * s;
				const sz = 12 + r(3) * 16;
				const op = interpolate(s, [1.6, 2.4], [1, 0], clamp);
				return (
					<div
						key={`${bi}-${k}`}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: sz,
							height: k % 3 === 0 ? sz : sz * 0.45,
							borderRadius: k % 3 === 0 ? sz : 3,
							background: CONFETTI[k % CONFETTI.length],
							transform: `rotate(${s * (300 + r(4) * 500) + r(5) * 360}deg) scaleX(${Math.cos(s * (8 + r(6) * 6))})`,
							opacity: op,
						}}
					/>
				);
			});
		})}
	</>
);

/* ---------- full-frame wall word ---------- */

const Wall: React.FC<{w: Word; s: number}> = ({w, s}) => {
	const text = w.text.toLocaleUpperCase('ru-RU');
	const rowH = 168;
	const rows = Math.ceil(H / rowH) + 1;
	const unit = `${text} • `;
	const size = 150;
	const uw = measureText({text: unit, fontFamily: 'Inter', fontWeight: '900', fontSize: size, letterSpacing: '-0.02em'}).width;
	const reps = Math.ceil((W * 2) / uw) + 2;
	const bg = ramp(s, 0, 0.08);
	return (
		<div style={{position: 'absolute', inset: 0, background: `rgba(247,243,251,${0.94 * bg})`, overflow: 'hidden'}}>
			{Array.from({length: rows}).map((_, r) => {
				const delay = r * 0.025;
				const a = ramp(s, delay, delay + 0.1);
				const dir = r % 2 === 0 ? -1 : 1;
				const x = ((dir * s * (340 + (r % 3) * 80)) % uw) - uw + ((r * 137) % uw) * 0.3;
				const kind = r % 3;
				return (
					<div
						key={r}
						style={{
							position: 'absolute',
							top: r * rowH - 20,
							left: x,
							fontFamily: FONT,
							fontWeight: 900,
							fontSize: size,
							lineHeight: 1,
							letterSpacing: '-0.02em',
							whiteSpace: 'nowrap',
							opacity: a,
							transform: `translateY(${(1 - a) * -30}px)`,
							color: kind === 0 ? C.ink : kind === 1 ? 'transparent' : C.pink,
							WebkitTextStroke: kind === 1 ? `4px ${C.ink}` : undefined,
						}}
					>
						{unit.repeat(reps)}
					</div>
				);
			})}
		</div>
	);
};

/* ---------- scene stage ---------- */

const sceneIndexAt = (t: number) => {
	let k = -1;
	DATA.scenes.forEach((sc, i) => {
		if (sc.start <= t + 1e-6) k = i;
	});
	return k;
};

const sceneProps = (k: number, tl: Timeline): SceneProps => {
	const sc = DATA.scenes[k];
	const end = DATA.scenes[k + 1]?.start ?? DATA.duration;
	const dur = Math.max(0.2, end - sc.start);
	const s = tl.t - sc.start;
	const inScene = DATA.words.filter((w) => w.i >= sc.firstWord && w.start <= tl.t && w.start >= sc.start - 1e-6);
	const cur = inScene[inScene.length - 1] ?? DATA.words[sc.firstWord];
	return {
		s,
		dur,
		p: Math.max(0, Math.min(1, s / dur)),
		t: tl.t,
		frame: tl.frame,
		sinceWord: tl.t - cur.start,
		wi: Math.max(0, inScene.length - 1),
		word: cur.text,
		rms: (back = 0) => DATA.rms[Math.max(0, tl.frame - back)] ?? 0,
		opt: sc.opt ?? {},
	};
};

const Stage: React.FC<{tl: Timeline}> = ({tl}) => {
	const k = sceneIndexAt(tl.t);
	if (k < 0) return null;
	const out: React.ReactNode[] = [];
	const since = tl.t - DATA.scenes[k].start;
	if (k > 0 && since < 0.25) {
		const prev = DATA.scenes[k - 1];
		const Prev = SCENES[prev.kind];
		const o = ramp(since, 0, 0.25);
		out.push(
			<div key="prev" style={{position: 'absolute', left: 0, top: STAGE_TOP, width: W, height: 760, opacity: 1 - o, filter: `blur(${o * 26}px)`, transform: `scale(${1 - o * 0.1})`, transformOrigin: '496px 340px'}}>
				{Prev && <Prev {...sceneProps(k - 1, tl)} />}
			</div>,
		);
	}
	const Cur = SCENES[DATA.scenes[k].kind];
	const e = ramp(since, 0, 0.32);
	const props = sceneProps(k, tl);
	const bump = 1 + 0.025 * Math.exp(-props.sinceWord * 10);
	const floatY = Math.sin(tl.t * 1.7) * 8;
	const rot = Math.sin(tl.t * 1.1) * 0.6;
	out.push(
		<div
			key="cur"
			style={{
				position: 'absolute',
				left: 0,
				top: STAGE_TOP,
				width: W,
				height: 760,
				opacity: e,
				filter: e < 0.99 ? `blur(${(1 - e) * 26}px)` : undefined,
				transform: `translateY(${(1 - e) * 60 + floatY}px) scale(${interpolate(e, [0, 1], [1.12, 1]) * bump}) rotate(${rot}deg)`,
				transformOrigin: '496px 340px',
			}}
		>
			{Cur && <Cur {...props} />}
		</div>,
	);
	return <>{out}</>;
};

/* ---------- composition ---------- */

export const Video2: React.FC = () => {
	const tl = timelineAt(useCurrentFrame());
	const wall = tl.word && tl.word.style === 'wall' ? tl.word : null;
	const lineOut = tl.line > 0 && tl.sinceLine < 0.18 ? tl.line - 1 : -1;
	const intro = tl.line < 0;
	return (
		<AbsoluteFill style={{width: W, height: H, overflow: 'hidden'}}>
			<Background t={tl.t} />
			{intro && (
				<div style={{position: 'absolute', left: SAFE.left, top: TEXT_TOP, opacity: 1 - ramp(tl.t, 0.3, 0.45)}}>
					<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.ink, letterSpacing: '-0.03em'}}>{DATA.artist}</div>
					<div style={{display: 'inline-block', marginTop: 10, padding: '6px 22px', borderRadius: 16, background: MARKERS[1], fontFamily: FONT, fontWeight: 800, fontSize: 88}}>{DATA.title.charAt(0) + DATA.title.slice(1).toLocaleLowerCase('ru-RU')}</div>
				</div>
			)}
			<Stage tl={tl} />
			{lineOut >= 0 && <Phrase tl={tl} line={lineOut} out={ramp(tl.sinceLine, 0, 0.18, outCubic)} />}
			{tl.line >= 0 && <Phrase tl={tl} line={tl.line} />}
			<Confetti t={tl.t} />
			{wall && <Wall w={wall} s={tl.sinceWord} />}
			<Hud tl={tl} scene={Math.max(0, sceneIndexAt(tl.t))} />
		</AbsoluteFill>
	);
};
