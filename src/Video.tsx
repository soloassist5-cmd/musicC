import React from 'react';
import {AbsoluteFill, interpolate, Easing, useCurrentFrame} from 'remotion';
import {C, FONT, H, rand, SAFE, SAFE_CX, W} from './theme';
import {DATA, Timeline, timelineAt} from './data';
import {Hud} from './hud';
import {CurrentWord, Wall} from './words';
import {Voice, Family, MapScene} from './scenes/scenes1';
import {Contact, Game, Clear, Chat} from './scenes/scenes2';
import {Wallet} from './scenes/scenes3';
import {clamp, SceneProps} from './scenes/common';

const SCENES: Record<string, React.FC<SceneProps>> = {
	voice: Voice,
	family: Family,
	map: MapScene,
	contact: Contact,
	game: Game,
	clear: Clear,
	chat: Chat,
	wallet: Wallet,
};

// top of the scene area (scene coords start here)
export const SCENE_TOP = 760;

const Background: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{background: C.bg}}>
		<AbsoluteFill
			style={{
				backgroundImage:
					'linear-gradient(rgba(0,0,0,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.045) 2px, transparent 2px)',
				backgroundSize: '90px 90px',
				backgroundPosition: `${SAFE.left}px ${-((t * 12) % 90)}px`,
			}}
		/>
		{/* crosshair in scene center */}
		<div style={{position: 'absolute', left: SAFE_CX - 1, top: SCENE_TOP - 40, width: 2, height: 40, background: 'rgba(0,0,0,0.15)'}} />
	</AbsoluteFill>
);

const Intro: React.FC<{tl: Timeline}> = ({tl}) => {
	const s = tl.t;
	const a = interpolate(s, [0, 0.12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const g = interpolate(s, [0.08, 0.24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', left: SAFE.left + 30, top: 620}}>
			<div
				style={{
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: 200,
					lineHeight: 1,
					letterSpacing: '-0.03em',
					color: 'transparent',
					WebkitTextStroke: `5px ${C.black}`,
					opacity: a,
					transform: `translateY(${(1 - a) * 25}px)`,
				}}
			>
				MADK1D
			</div>
			<div style={{position: 'relative', display: 'inline-block', marginTop: 24, padding: '16px 30px 20px'}}>
				<div style={{position: 'absolute', inset: 0, background: C.red, transform: `scaleX(${g})`, transformOrigin: 'left'}} />
				<div style={{position: 'relative', fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: 1, color: '#fff', clipPath: `inset(-10% ${(1 - g) * 100}% -10% -10%)`}}>
					ПЕРЕСТАНЬ
				</div>
			</div>
		</div>
	);
};

const SceneLayer: React.FC<{tl: Timeline}> = ({tl}) => {
	if (tl.line < 0) return null;
	const out: React.ReactNode[] = [];
	const enter = interpolate(tl.sinceLine, [0, 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	// previous scene leaves upward for the first 0.2 s
	if (tl.line > 0 && tl.sinceLine < 0.2) {
		const prevWords = DATA.words.filter((w) => w.line === tl.line - 1);
		const lastPrev = prevWords[prevWords.length - 1];
		const ptl: Timeline = {
			...tl,
			line: tl.line - 1,
			word: lastPrev,
			lineWords: prevWords,
			wordInLine: prevWords.length - 1,
			lineStart: prevWords[0].start,
			lineEnd: tl.lineStart,
			sinceLine: tl.t - prevWords[0].start,
			sinceWord: tl.t - lastPrev.start,
		};
		const Prev = SCENES[DATA.scenes[tl.line - 1]];
		const o = interpolate(tl.sinceLine, [0, 0.2], [1, 0], clamp);
		out.push(
			<div key="prev" style={{position: 'absolute', left: 0, top: SCENE_TOP, width: W, transform: `translateY(${(o - 1) * 80}px)`, opacity: o}}>
				<Prev tl={ptl} rms={DATA.rms} />
			</div>,
		);
	}
	const Cur = SCENES[DATA.scenes[tl.line]];
	out.push(
		<div key="cur" style={{position: 'absolute', left: 0, top: SCENE_TOP, width: W, transform: `translateY(${(1 - enter) * 160}px)`, opacity: enter}}>
			<Cur tl={tl} rms={DATA.rms} />
		</div>,
	);
	return <>{out}</>;
};

export const Video: React.FC = () => {
	const frame = useCurrentFrame();
	const tl = timelineAt(frame);
	// short frame shake on each new word
	const sh = tl.word && tl.word.style !== 'wall' ? Math.max(0, 1 - tl.sinceWord / 0.15) : 0;
	const sx = (rand(tl.frame * 1.3) - 0.5) * 18 * sh;
	const sy = (rand(tl.frame * 2.7 + 5) - 0.5) * 14 * sh;
	const wall = tl.word && tl.word.style === 'wall' ? tl.word : null;
	return (
		<AbsoluteFill style={{background: C.bg, overflow: 'hidden', width: W, height: H}}>
			<Background t={tl.t} />
			<AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
				{tl.line < 0 && <Intro tl={tl} />}
				<SceneLayer tl={tl} />
				<CurrentWord tl={tl} />
			</AbsoluteFill>
			{wall && <Wall w={wall} s={tl.sinceWord} />}
			<Hud tl={tl} onWall={!!wall} />
		</AbsoluteFill>
	);
};
