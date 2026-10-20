import React from 'react';
import {interpolate, Easing} from 'remotion';
import {C, FONT, SAFE_CX} from '../theme';
import {Avatar, Card, clamp, lineProgress, Mono, Pill, pulse, SceneProps, Txt, upper} from './common';

const CW = 780;
const X = SAFE_CX - CW / 2;

const Heart: React.FC<{half?: 'l' | 'r'; size: number; color: string}> = ({half, size, color}) => {
	const heart = 'M50 88 C20 66 4 48 4 30 C4 16 15 6 28 6 C38 6 46 12 50 20 C54 12 62 6 72 6 C85 6 96 16 96 30 C96 48 80 66 50 88 Z';
	const clip = half === 'l' ? 'M0 0 H50 L44 30 L56 46 L46 62 L52 100 H0 Z' : half === 'r' ? 'M50 0 H100 V100 H52 L46 62 L56 46 L44 30 Z' : undefined;
	const id = `h${half ?? 'f'}`;
	return (
		<svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible'}}>
			{clip && (
				<clipPath id={id}>
					<path d={clip} />
				</clipPath>
			)}
			<path d={heart} fill={color} clipPath={clip ? `url(#${id})` : undefined} />
		</svg>
	);
};

// 4. Lost contact: heart cracks in two
export const Contact: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.035);
	const crack = interpolate(lp, [0.25, 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
	const fall = interpolate(lp, [0.45, 1], [0, 1], clamp);
	const beat = 1 + 0.12 * Math.exp(-tl.sinceWord * 9);
	const dashOp = interpolate(crack, [0, 1], [1, 0.25]);
	return (
		<>
			<Card style={{left: X, top: 30, width: CW, height: 410, transform: `scale(${p})`}}>
				<div style={{position: 'absolute', left: 34, top: 26}}>
					<Mono size={24}>КОНТАКТ</Mono>
				</div>
				<div style={{position: 'absolute', left: 60, top: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<Avatar size={170} me />
					<Txt size={30}>MADK1D</Txt>
				</div>
				<div style={{position: 'absolute', right: 60, top: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<Avatar size={170} dark={crack > 0.5} />
					<Mono size={26} color={C.muted}>НЕТ РЯДОМ</Mono>
				</div>
				<div style={{position: 'absolute', left: 250, right: 250, top: 184, borderTop: `5px dashed ${C.red}`, opacity: dashOp}} />
				<div style={{position: 'absolute', left: CW / 2 - 70, top: 120, width: 140, height: 140}}>
					{crack < 0.02 ? (
						<div style={{transform: `scale(${beat})`}}>
							<Heart size={140} color={C.red} />
						</div>
					) : (
						<>
							<div style={{position: 'absolute', inset: 0, transform: `translate(${-26 * crack}px, ${fall * 30}px) rotate(${-16 * crack - fall * 8}deg)`}}>
								<Heart half="l" size={140} color={C.red} />
							</div>
							<div style={{position: 'absolute', inset: 0, transform: `translate(${26 * crack}px, ${fall * 44}px) rotate(${16 * crack + fall * 10}deg)`}}>
								<Heart half="r" size={140} color={C.red} />
							</div>
						</>
					)}
				</div>
			</Card>
			<div style={{position: 'absolute', left: SAFE_CX, top: 470, transform: `translateX(-50%) scale(${interpolate(crack, [0, 1], [0.6, 1])})`, opacity: crack}}>
				<Pill bg={C.black} style={{fontSize: 32}}>
					<span style={{color: C.red}}>✕</span> нет соединения
				</Pill>
			</div>
		</>
	);
};

const Gamepad: React.FC<{size: number}> = ({size}) => (
	<svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120}>
		<path d="M30 10 H90 C108 10 118 30 118 50 C118 66 110 76 100 76 C90 76 84 64 76 58 H44 C36 64 30 76 20 76 C10 76 2 66 2 50 C2 30 12 10 30 10 Z" fill="none" stroke={C.blue} strokeWidth="7" />
		<path d="M30 30 V50 M20 40 H40" stroke={C.blue} strokeWidth="7" strokeLinecap="round" />
		<circle cx="84" cy="34" r="6" fill={C.blue} />
		<circle cx="96" cy="46" r="6" fill={C.blue} />
	</svg>
);

// 5. Game stuck on pause at 60%
export const Game: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.035);
	const prog = interpolate(lp, [0, 0.55], [0.04, 0.6], {...clamp, easing: Easing.out(Easing.cubic)});
	const paused = lp > 0.55;
	const blink = Math.floor(tl.t * 3) % 2 === 0;
	return (
		<Card style={{left: X, top: 40, width: CW, height: 470, transform: `scale(${p})`, overflow: 'hidden'}}>
			{/* cover art */}
			<div style={{position: 'absolute', left: 30, top: 30, width: 250, height: 410, borderRadius: 18, overflow: 'hidden', background: C.black}}>
				<div style={{position: 'absolute', left: -40, top: 60, width: 260, height: 260, borderRadius: 130, background: C.red, opacity: 0.9}} />
				<div style={{position: 'absolute', left: 90, top: 200, width: 200, height: 200, borderRadius: 100, background: C.blue, mixBlendMode: 'screen'}} />
				<div style={{position: 'absolute', left: 18, bottom: 18, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', lineHeight: 0.95}}>
					LVL
					<br />
					06
				</div>
			</div>
			<div style={{position: 'absolute', left: 316, top: 40}}>
				<Mono size={22}>madk1d · сохранение</Mono>
			</div>
			<div style={{position: 'absolute', left: 316, top: 74}}>
				<Txt size={64} weight={900}>ИГРА</Txt>
			</div>
			<div style={{position: 'absolute', left: 316, top: 180, transform: `scale(${1 + 0.08 * Math.exp(-tl.sinceWord * 10)})`, transformOrigin: 'left center'}}>
				<Gamepad size={170} />
			</div>
			<div style={{position: 'absolute', left: 316, right: 36, top: 330, height: 16, borderRadius: 8, background: C.soft}}>
				<div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 8, background: C.blue}} />
			</div>
			<div style={{position: 'absolute', right: 36, top: 296}}>
				<Mono size={22} color={C.blue}>{Math.round(prog * 100)}%</Mono>
			</div>
			<div style={{position: 'absolute', left: 316, top: 376, opacity: paused ? (blink ? 1 : 0.55) : 0.35}}>
				<Pill bg={paused ? C.black : C.soft} color={paused ? '#fff' : C.muted} style={{fontSize: 28}}>
					❚❚ ПАУЗА
				</Pill>
			</div>
		</Card>
	);
};

// 6. Clear all: "ненужное" flies on an arc into the trash
export const Clear: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.03);
	const fly = interpolate(lp, [0.15, 0.7], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const x0 = 70;
	const y0 = 230;
	const x1 = 560;
	const y1 = 250;
	const bx = x0 + (x1 - x0) * fly;
	const by = y0 + (y1 - y0) * fly - Math.sin(fly * Math.PI) * 200;
	const lid = interpolate(lp, [0.4, 0.6, 0.85, 1], [0, -28, -28, -8], clamp);
	const gone = fly > 0.97;
	const shake = interpolate(lp, [0.7, 0.78], [1, 0], clamp) * Math.sin(tl.t * 60) * 6;
	return (
		<Card style={{left: X, top: 40, width: CW, height: 470, transform: `scale(${p})`}}>
			<div style={{position: 'absolute', left: 40, top: 36}}>
				<Txt size={50} weight={900}>Очистить всё</Txt>
			</div>
			<div style={{position: 'absolute', left: 40, top: 100}}>
				<Mono size={26}>оставь в прошлом</Mono>
			</div>
			{/* trash */}
			<div style={{position: 'absolute', left: x1 - 20, top: 210, width: 170, height: 220, transform: `translateX(${shake}px)`}}>
				<div style={{position: 'absolute', left: -6, top: 0, width: 182, height: 22, borderRadius: 6, background: C.black, transform: `rotate(${lid}deg)`, transformOrigin: '8% 100%'}} />
				<div style={{position: 'absolute', left: 60, top: -18, width: 50, height: 20, borderRadius: '8px 8px 0 0', border: `6px solid ${C.black}`, borderBottom: 'none', transform: `rotate(${lid}deg)`, transformOrigin: '-30% 100%'}} />
				<div style={{position: 'absolute', left: 10, top: 30, width: 150, height: 180, borderRadius: '0 0 18px 18px', background: C.soft, border: `5px solid ${C.black}`, boxSizing: 'border-box', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
					{[0, 1, 2].map((k) => (
						<div key={k} style={{width: 7, height: 110, borderRadius: 4, background: C.black, opacity: 0.6}} />
					))}
				</div>
			</div>
			{/* flying chip */}
			{!gone && (
				<div style={{position: 'absolute', left: bx, top: by, transform: `rotate(${fly * 200}deg) scale(${1 - fly * 0.55})`, transformOrigin: 'center'}}>
					<div style={{background: '#fff', border: `3px solid ${C.black}`, borderRadius: 14, padding: '14px 24px', boxShadow: `6px 6px 0 ${C.black}`, display: 'flex', alignItems: 'center', gap: 12}}>
						<span style={{width: 16, height: 16, background: C.red, borderRadius: 4}} />
						<Txt size={34}>ненужное</Txt>
					</div>
				</div>
			)}
			<div style={{position: 'absolute', left: 40, bottom: 34, opacity: gone ? 1 : 0.3}}>
				<Mono size={24} color={gone ? C.red : C.muted}>{gone ? '✓ удалено: 1 объект' : 'выбрано: 1 объект'}</Mono>
			</div>
		</Card>
	);
};

// 7. Chat: typing dots, then a blue reply with the current word
export const Chat: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.03);
	const replied = tl.sinceLine > Math.min(0.9, (tl.lineEnd - tl.lineStart) * 0.25);
	const rp = interpolate(tl.sinceLine - Math.min(0.9, (tl.lineEnd - tl.lineStart) * 0.25), [0, 0.2], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
	const word = tl.word ? upper(tl.word.text) : '';
	const read = lp > 0.7;
	return (
		<Card style={{left: X, top: 30, width: CW, height: 500, transform: `scale(${p})`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 96, borderBottom: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 20}}>
				<Avatar size={60} />
				<Txt size={38} weight={900}>Сообщения</Txt>
				<div style={{flex: 1}} />
				<Mono size={22} color={C.green}>● онлайн</Mono>
			</div>
			<div style={{position: 'absolute', left: 34, top: 130, background: C.soft, borderRadius: '30px 30px 30px 8px', padding: '24px 30px', display: 'flex', gap: 12}}>
				{[0, 1, 2].map((k) => (
					<div key={k} style={{width: 20, height: 20, borderRadius: 10, background: '#8C8880', transform: `translateY(${-Math.max(0, Math.sin(tl.t * 10 - k * 0.9)) * 12}px)`}} />
				))}
			</div>
			{replied && (
				<div style={{position: 'absolute', right: 34, top: 250, transform: `scale(${rp})`, transformOrigin: 'right bottom', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10}}>
					<div style={{background: C.blue, color: '#fff', borderRadius: '30px 30px 8px 30px', padding: '22px 34px', fontFamily: FONT, fontWeight: 900, fontSize: Math.min(56, Math.floor(560 / Math.max(4, word.length) * 1.6)), maxWidth: 620, whiteSpace: 'nowrap'}}>
						{word}
					</div>
					<Mono size={22} color={read ? C.blue : C.muted}>
						доставлено {read ? '→ прочитано ✓✓' : '✓'}
					</Mono>
				</div>
			)}
		</Card>
	);
};
