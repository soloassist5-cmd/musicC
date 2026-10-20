import React from 'react';
import {interpolate, Easing} from 'remotion';
import {C, MONO, SAFE_CX} from '../theme';
import {Card, clamp, FigNote, lineProgress, Mono, Pill, pulse, SceneProps, Txt} from './common';

const CW = 780;
const X = SAFE_CX - CW / 2;

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ');

const Win: React.FC<{title: string; x: number; y: number; s: number; rot: number; children?: React.ReactNode}> = ({title, x, y, s, rot, children}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: 330,
			background: '#fff',
			border: `4px solid ${C.black}`,
			boxShadow: `12px 12px 0 ${C.black}`,
			transform: `scale(${s}) rotate(${rot}deg)`,
			transformOrigin: 'center',
			opacity: s > 0.01 ? 1 : 0,
		}}
	>
		<div style={{height: 46, background: C.black, color: '#fff', display: 'flex', alignItems: 'center', padding: '0 14px', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 22}}>
			<span>{title}</span>
			<span>✕</span>
		</div>
		<div style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>{children}</div>
	</div>
);

// 8. Wallet: balance counts up, +24 300 on each word, popups
export const Wallet: React.FC<SceneProps> = ({tl}) => {
	const lp = lineProgress(tl);
	const p = pulse(tl, 0.035);
	const bal = interpolate(lp, [0, 0.85], [0, 98400], {...clamp, easing: Easing.out(Easing.cubic)});
	const chip = interpolate(tl.sinceWord, [0, 0.12, 0.45, 0.6], [0, 1, 1, 0.85], clamp);
	const chipY = interpolate(tl.sinceWord, [0, 0.5], [16, -10], clamp);
	const toast = interpolate(lp, [0.55, 0.65], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const w1 = interpolate(lp, [0.15, 0.25], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const w2 = interpolate(lp, [0.35, 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const paid = lp > 0.5;
	return (
		<>
			<Card style={{left: X, top: 40, width: CW, height: 290, transform: `scale(${p})`}}>
				<div style={{position: 'absolute', left: 40, top: 34}}>
					<Mono size={24}>Кошелёк · madk1d</Mono>
				</div>
				<div style={{position: 'absolute', left: 40, top: 80}}>
					<Txt size={30} color={C.muted} weight={800}>Баланс</Txt>
				</div>
				<div style={{position: 'absolute', left: 40, top: 120}}>
					<Txt size={96} weight={900} style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(bal)} ₽</Txt>
				</div>
				<div style={{position: 'absolute', right: 40, top: 40, width: 80, height: 80, borderRadius: 40, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Txt size={44} color="#fff" weight={900}>m</Txt>
				</div>
				<div style={{position: 'absolute', right: 40, bottom: 26, transform: `translateY(${chipY}px) scale(${chip})`, transformOrigin: 'right center'}}>
					<Pill bg="#DDF3E6" color={C.green} style={{fontSize: 32}}>+ 24 300 ₽</Pill>
				</div>
				<div style={{position: 'absolute', left: 40, bottom: 30}}>
					<Mono size={22} color={C.black}>меняют меня →</Mono>
				</div>
			</Card>
			<div style={{position: 'absolute', left: X, top: -40, transformOrigin: 'left center', transform: `translateY(${(1 - toast) * -30}px) scale(${toast})`, opacity: toast}}>
				<Pill bg={C.black} style={{fontSize: 30}}>
					<span style={{color: '#3DDC84'}}>✓</span> Перевод получен
				</Pill>
			</div>
			<Win title="корзина.exe" x={X + 10} y={340} s={w1} rot={-3}>
				<Txt size={30}>Продукт × 1</Txt>
				<Mono size={22} color={C.muted}>итого: 24 300 ₽</Mono>
			</Win>
			<Win title="оплата.exe" x={X + 400} y={360} s={w2} rot={2.5}>
				<Txt size={30}>Списать?</Txt>
				<div style={{background: paid ? C.red : C.black, color: '#fff', fontFamily: MONO, fontWeight: 700, fontSize: 26, padding: '12px 0', textAlign: 'center', border: `3px solid ${C.black}`}}>
					{paid ? 'ОПЛАЧЕНО' : 'ОПЛАТИТЬ'}
				</div>
			</Win>
			<FigNote x={X + 470} y={160} dx={130} dy={-170} n={8} text="баланс, растёт" p={interpolate(tl.sinceLine, [0.2, 0.8], [0, 1], clamp)} />
		</>
	);
};
