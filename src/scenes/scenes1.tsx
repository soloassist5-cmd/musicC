import React from 'react';
import {interpolate, Easing} from 'remotion';
import {C, SAFE_CX, MONO} from '../theme';
import {Avatar, Card, clamp, FigNote, lineProgress, Mono, Pill, pulse, SceneProps, Txt, upper} from './common';

const CW = 780;
const X = SAFE_CX - CW / 2;

// 1. Voice message
export const Voice: React.FC<SceneProps> = ({tl, rms}) => {
	const bars = 24;
	const p = pulse(tl);
	const lp = lineProgress(tl);
	const word = tl.word ? upper(tl.word.text) : '';
	const ws = interpolate(tl.sinceWord, [0, 0.12], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const secs = Math.floor(tl.sinceLine);
	return (
		<>
			<Card style={{left: X, top: 120, width: CW, height: 200, transform: `scale(${p})`, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 26, boxSizing: 'border-box'}}>
				<Avatar size={112} me />
				<div style={{display: 'flex', flexDirection: 'column', gap: 6, width: 130}}>
					<Txt size={36}>madk1d</Txt>
					<Mono size={22}>голосовое</Mono>
					<Mono size={22} color={C.blue}>0:{String(secs).padStart(2, '0')}</Mono>
				</div>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 120, flex: 1, minWidth: 0}}>
					{Array.from({length: bars}).map((_, k) => {
						const f = Math.max(0, tl.frame - (bars - k) * 2);
						const v = rms[f] ?? 0;
						const played = k / bars < lp;
						return (
							<div
								key={k}
								style={{
									width: 7,
									borderRadius: 4,
									height: 10 + v * 100 * (0.55 + 0.45 * Math.abs(Math.sin(k * 1.7))),
									background: played ? C.blue : '#B9CCF5',
								}}
							/>
						);
					})}
				</div>
				<div style={{width: 92, height: 92, borderRadius: 46, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexShrink: 0}}>
					<div style={{width: 10, height: 34, background: '#fff', borderRadius: 3}} />
					<div style={{width: 10, height: 34, background: '#fff', borderRadius: 3}} />
				</div>
			</Card>
			<div style={{position: 'absolute', left: X + 60, top: 360, transform: `scale(${ws})`, transformOrigin: 'left center'}}>
				<Pill bg={C.black} style={{fontSize: 40, padding: '16px 30px', borderRadius: 18}}>
					<span style={{width: 14, height: 14, borderRadius: 7, background: C.red}} />
					{word}
				</Pill>
			</div>
			<FigNote x={X + CW - 160} y={320} dx={-90} dy={150} n={1} text="голос. сообщение, не отправлено" p={interpolate(tl.sinceLine, [0.2, 0.8], [0, 1], clamp)} />
		</>
	);
};

// 2. Family: dad goes under the ground line, mom rises along a dotted path
export const Family: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const e = Easing.inOut(Easing.cubic)(lp);
	const ground = 380;
	const p = pulse(tl, 0.05);
	const dadY = interpolate(e, [0, 1], [ground - 190, ground + 40]);
	const momY = interpolate(e, [0, 1], [ground - 190, 20]);
	const person = (label: string, y: number, x: number, dark: boolean) => (
		<div style={{position: 'absolute', left: x - 80, top: y, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${p})`}}>
			<Avatar size={140} dark={dark} />
			<Pill bg={dark ? C.black : C.card} color={dark ? '#fff' : C.black} style={{fontSize: 26, padding: '6px 18px', border: `2px solid ${C.border}`}}>
				{label}
			</Pill>
		</div>
	);
	return (
		<>
			{/* sky marker */}
			<div style={{position: 'absolute', left: SAFE_CX + 120, top: -10}}>
				<Mono size={24} color={C.blue}>↑ НЕБО</Mono>
			</div>
			{/* dotted path */}
			<div style={{position: 'absolute', left: SAFE_CX + 168, top: 30, height: ground - 60, borderLeft: `4px dashed ${C.blue}`, opacity: 0.6}} />
			{/* mom */}
			{person('МАМА', momY, SAFE_CX + 170, false)}
			{/* dad, clipped by ground */}
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: ground, overflow: 'hidden'}}>{person('ПАПА', dadY, SAFE_CX - 170, true)}</div>
			{/* ground */}
			<div style={{position: 'absolute', left: SAFE_CX - 400, top: ground, width: 800, height: 5, background: C.black}} />
			<div
				style={{
					position: 'absolute',
					left: SAFE_CX - 400,
					top: ground + 5,
					width: 800,
					height: 150,
					background: `repeating-linear-gradient(135deg, rgba(0,0,0,0.13) 0 3px, transparent 3px 22px)`,
				}}
			/>
			<div style={{position: 'absolute', left: SAFE_CX - 400, top: ground + 18}}>
				<Mono size={24} color={C.black}>ЗЕМЛЯ / 0.00 м</Mono>
			</div>
			<div style={{position: 'absolute', left: SAFE_CX - 170 - 60, top: ground + 60}}>
				<Mono size={24} color={C.red}>−{(e * 2).toFixed(2)} м</Mono>
			</div>
		</>
	);
};

// 3. Map with a route drawing over the line
export const MapScene: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.03);
	const route = 'M 70 400 C 160 330, 200 250, 320 260 S 470 150, 520 200 S 610 120, 650 110';
	const L = 900;
	const dots = Math.floor(tl.t * 4) % 4;
	return (
		<>
			<Card style={{left: X, top: 40, width: CW, height: 520, overflow: 'hidden', transform: `scale(${p})`}}>
				<svg width={CW} height={520} viewBox={`0 0 ${CW} 520`} style={{position: 'absolute', inset: 0}}>
					<rect width={CW} height={520} fill="#F2F0EA" />
					<rect x="440" y="300" width="300" height="200" fill="#D6E4F7" />
					<rect x="90" y="60" width="130" height="90" rx="8" fill="#DCE8D5" />
					<rect x="300" y="360" width="90" height="70" rx="8" fill="#DCE8D5" />
					{[
						'M -20 180 L 800 120',
						'M -20 330 L 800 380',
						'M 250 -20 L 200 560',
						'M 560 -20 L 600 560',
						'M -20 470 L 420 20',
					].map((d) => (
						<path key={d} d={d} stroke="#fff" strokeWidth="22" fill="none" />
					))}
					{['M 100 -20 L 140 560', 'M 400 -20 L 380 560', 'M -20 250 L 800 260'].map((d) => (
						<path key={d} d={d} stroke="#fff" strokeWidth="10" fill="none" />
					))}
					<path d={route} stroke={C.blue} strokeOpacity={0.18} strokeWidth="12" fill="none" strokeLinecap="round" />
					<path d={route} stroke={C.blue} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - lp)} />
					<circle cx="70" cy="400" r="14" fill="#fff" stroke={C.blue} strokeWidth="6" />
				</svg>
				{/* red pin */}
				<div style={{position: 'absolute', left: 650 - 50, top: 110 - 50, width: 100, height: 100, borderRadius: 50, border: `4px solid ${C.red}`, transform: `scale(${0.8 + 0.3 * Math.abs(Math.sin(tl.t * 4))})`, opacity: 0.6}} />
				<div style={{position: 'absolute', left: 650 - 16, top: 110 - 16, width: 32, height: 32, borderRadius: 16, background: C.red, border: '5px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'}} />
				{/* blue typing bubble */}
				<div style={{position: 'absolute', left: 120, top: 210, transform: `scale(${p * 1.02})`}}>
					<Pill bg={C.blue} style={{fontSize: 44, padding: '6px 26px', letterSpacing: 6}}>
						{['•', '•', '•'].map((d, k) => (
							<span key={k} style={{opacity: k <= dots ? 1 : 0.35}}>{d}</span>
						))}
					</Pill>
				</div>
				<div style={{position: 'absolute', left: 24, bottom: 20}}>
					<Mono size={22} color={C.black}>{(55.75 + lp * 0.012).toFixed(4)}° N · {(37.61 + lp * 0.02).toFixed(4)}° E</Mono>
				</div>
			</Card>
			<FigNote x={X + 650} y={150} dx={-150} dy={-90} n={3} text="где-то: ???" p={interpolate(tl.sinceLine, [0.3, 0.9], [0, 1], clamp)} />
		</>
	);
};

export {MONO};
