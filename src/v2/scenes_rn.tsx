import React from 'react';
import {interpolate} from 'remotion';
import {C, rand} from '../theme';
import {Abs, Avatar, Bar, Card, Check, clamp, Col, Icon, M, outBack, outCubic, Pill, ramp, Row, SceneProps, T} from './ui';

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ');

// calendar: Monday, dad at work
const Calendar: React.FC<SceneProps> = ({s, p}) => {
	const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
	const ev = ramp(s, 0.3, 0.55, outBack);
	return (
		<Card y={30} h={640}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 170, background: C.red}}>
				<Col gap={0} style={{alignItems: 'center', paddingTop: 22}}>
					<T s={34} w={700} c="rgba(255,255,255,0.85)">Понедельник</T>
					<T s={96} w={800} c="#fff" style={{lineHeight: 1}}>20</T>
				</Col>
			</div>
			<Row gap={0} style={{position: 'absolute', left: 30, right: 30, top: 200, justifyContent: 'space-between'}}>
				{days.map((d, k) => (
					<Col key={d} gap={6} style={{alignItems: 'center', width: 90, padding: '12px 0', borderRadius: 20, background: k === 0 ? '#FFE9E8' : 'transparent'}}>
						<M s={22} c={k === 0 ? C.red : C.sub}>{d}</M>
						<T s={34} w={800} c={k === 0 ? C.red : C.ink}>{20 + k}</T>
					</Col>
				))}
			</Row>
			<div style={{position: 'absolute', left: 30, right: 30, top: 340, transform: `scale(${ev})`, transformOrigin: 'left center', opacity: ev}}>
				<div style={{borderLeft: `10px solid ${C.blue}`, background: '#E8F1FF', borderRadius: 18, padding: '22px 26px'}}>
					<Row style={{justifyContent: 'space-between'}}>
						<T s={36} w={800}>Папа · работа</T>
						<M s={22} c={C.blue}>09:00–18:00</M>
					</Row>
					<M s={22}>офис · весь день</M>
				</div>
			</div>
			<Abs x={30} y={500} style={{width: 720}}>
				<Row gap={14}>
					<M s={22}>прошло</M>
					<Bar w={540} h={14} v={p} c={C.blue} />
				</Row>
			</Abs>
			<Abs x={30} y={560}>
				<Pill bg={C.fill} c={C.ink} s={24}>⏰ будильник 07:00 · выключен</Pill>
			</Abs>
		</Card>
	);
};

// to-do: everything done, not a slacker
const Todo: React.FC<SceneProps> = ({s, p}) => {
	const items = ['записать куплет', 'свести трек', 'снять видео', 'выложить'];
	return (
		<Card y={30} h={640}>
			<Abs x={40} y={36}>
				<Col gap={4}>
					<T s={44} w={800}>Сегодня</T>
					<M>{Math.min(items.length, Math.floor(p * 1.25 * items.length))}/{items.length} выполнено</M>
				</Col>
			</Abs>
			<Abs x={40} y={160} style={{width: 700}}>
				<Col gap={0}>
					{items.map((it, k) => {
						const done = ramp(p, (k / items.length) * 0.75, (k / items.length) * 0.75 + 0.08, outBack);
						return (
							<Row key={it} gap={22} style={{padding: '22px 0', borderBottom: `2px solid ${C.line}`}}>
								<div style={{width: 52, height: 52, borderRadius: 26, border: `4px solid ${done > 0.5 ? C.green : C.line}`, background: done > 0.5 ? C.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * done})`}}>
									{done > 0.5 && <T s={28} c="#fff">✓</T>}
								</div>
								<T s={34} w={600} c={done > 0.5 ? C.sub : C.ink} style={{textDecoration: done > 0.5 ? 'line-through' : 'none'}}>{it}</T>
							</Row>
						);
					})}
				</Col>
			</Abs>
			<Abs x={40} y={560}>
				<Pill bg="#E3F8E9" c={C.green} s={26} style={{opacity: ramp(p, 0.85, 0.95)}}>не бездельник ✓</Pill>
			</Abs>
		</Card>
	);
};

const TvIcon: React.FC<{size: number; on: number; t: number}> = ({size, on, t}) => (
	<svg viewBox="0 0 200 150" width={size} height={size * 0.75}>
		<rect x="6" y="6" width="188" height="112" rx="10" fill="#111" />
		<defs>
			<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stopColor="#FF5FA2" />
				<stop offset="0.5" stopColor="#AF52DE" />
				<stop offset="1" stopColor="#0A84FF" />
			</linearGradient>
		</defs>
		<rect x="14" y="14" width="172" height="96" rx="4" fill="url(#scr)" opacity={on} />
		<circle cx={100 + Math.sin(t * 2) * 40} cy={62} r={18} fill="#fff" opacity={0.35 * on} />
		<rect x="80" y="122" width="40" height="10" fill="#222" />
		<rect x="56" y="132" width="88" height="8" rx="4" fill="#222" />
	</svg>
);

// a new TV for her dad
const Tv: React.FC<SceneProps> = ({p, t}) => {
	const paid = p > 0.55;
	const on = ramp(p, 0.6, 0.75);
	return (
		<Card y={30} h={640}>
			<div style={{position: 'absolute', left: 24, right: 24, top: 24, height: 330, borderRadius: 30, background: 'linear-gradient(160deg,#F1F1F5,#DADAE2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<TvIcon size={420} on={on} t={t} />
			</div>
			<Abs x={40} y={380}>
				<Col gap={4}>
					<M>для бати · доставка завтра</M>
					<T s={44} w={800}>Новый телек 65″</T>
					<T s={40} w={800}>89 990 ₽</T>
				</Col>
			</Abs>
			<Abs x={24} y={540}>
				<div style={{width: 732, height: 80, borderRadius: 24, background: paid ? C.green : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<T s={32} w={800} c="#fff">{paid ? '✓ Куплено' : 'Купить'}</T>
				</div>
			</Abs>
		</Card>
	);
};

// who is that guy — STOP
const Stop: React.FC<SceneProps> = ({p, sinceWord, t}) => {
	const stop = ramp(p, 0.55, 0.68, outBack);
	return (
		<Card y={30} h={640}>
			<Abs x={0} y={50} style={{width: 780, display: 'flex', justifyContent: 'center'}}>
				<div style={{position: 'relative'}}>
					<Avatar size={220} />
					<div style={{position: 'absolute', right: -10, bottom: 0, width: 70, height: 70, borderRadius: 35, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.15)'}}>
						<T s={40} w={800} c={C.sub}>?</T>
					</div>
				</div>
			</Abs>
			<Col gap={4} style={{position: 'absolute', left: 0, right: 0, top: 300, alignItems: 'center'}}>
				<T s={44} w={800}>Неизвестный</T>
				<M s={24}>рядом с ней · {Math.max(1, Math.round(5 - p * 4))} м</M>
			</Col>
			<div style={{position: 'absolute', left: 390 - 120, top: 400, transform: `scale(${stop * (1 + 0.05 * Math.sin(t * 14) * stop)}) rotate(${-8 + 8 * stop}deg)`, opacity: stop}}>
				<svg viewBox="0 0 100 100" width={240} height={240}>
					<path d="M30 3 H70 L97 30 V70 L70 97 H30 L3 70 V30 Z" fill={C.red} stroke="#fff" strokeWidth="4" />
					<text x="50" y="60" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="26" fill="#fff">СТОП</text>
				</svg>
			</div>
			{stop === 0 && (
				<Abs x={0} y={420} style={{width: 780, display: 'flex', justifyContent: 'center', transform: `scale(${1 + 0.04 * Math.exp(-sinceWord * 9)})`}}>
					<Pill bg={C.fill} c={C.ink} s={30}>Чё за парень?</Pill>
				</Abs>
			)}
		</Card>
	);
};

// blocked / ran off
const Blocked: React.FC<SceneProps> = ({p, t}) => {
	const run = ramp(p, 0.1, 0.8, (x) => x);
	const x = 140 + run * 560;
	return (
		<Card y={30} h={640}>
			<Abs x={40} y={36}>
				<Row gap={14}>
					<Icon bg={C.red} size={60}>✕</Icon>
					<Col gap={2}>
						<T s={36} w={800}>Контакт заблокирован</T>
						<M>больше не напишет</M>
					</Col>
				</Row>
			</Abs>
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, height: 300, background: '#F3F1EC', overflow: 'hidden'}}>
				{Array.from({length: 10}).map((_, k) => (
					<div key={k} style={{position: 'absolute', left: ((k * 120 - t * 600) % 1200 + 1200) % 1200 - 200, top: 145, width: 70, height: 10, borderRadius: 5, background: '#fff'}} />
				))}
				{Array.from({length: 6}).map((_, k) => (
					<div key={`s${k}`} style={{position: 'absolute', left: x - 120 - k * 30, top: 80 + k * 22, width: 90 - k * 10, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.18)'}} />
				))}
				<div style={{position: 'absolute', left: x - 50, top: 80, transform: `rotate(${Math.sin(t * 20) * 6}deg)`}}>
					<Avatar size={100} />
				</div>
				<Abs x={x - 40} y={200}>
					<M s={22} c={C.red}>{Math.round(run * 3000)} м от тебя</M>
				</Abs>
			</div>
			<Abs x={40} y={510} style={{width: 700}}>
				<Row gap={18}>
					<div style={{flex: 1, height: 90, borderRadius: 24, background: '#FFE9E8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={32} w={800} c={C.red}>Заблокирован</T>
					</div>
					<div style={{width: 90, height: 90, borderRadius: 24, background: C.fill, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={36} c={C.sub}>⋯</T>
					</div>
				</Row>
			</Abs>
		</Card>
	);
};

// fight game, K.O.
const Ko: React.FC<SceneProps> = ({p, sinceWord}) => {
	const hp = interpolate(p, [0.1, 0.6], [1, 0], {...clamp, easing: outCubic});
	const ko = ramp(p, 0.6, 0.72, outBack);
	const hit = Math.exp(-sinceWord * 10);
	return (
		<Card y={30} h={620} style={{background: 'linear-gradient(180deg,#1A1A24,#2E1A3A)'}}>
			<Row gap={16} style={{position: 'absolute', left: 30, right: 30, top: 34, justifyContent: 'space-between'}}>
				<Col gap={8}>
					<T s={26} w={800} c="#fff">Toxi$</T>
					<Bar w={300} h={20} v={1} c={C.green} bg="rgba(255,255,255,0.15)" />
				</Col>
				<Col gap={8} style={{alignItems: 'flex-end'}}>
					<T s={26} w={800} c="#fff">ПАРЕНЬ</T>
					<div style={{transform: 'scaleX(-1)'}}>
						<Bar w={300} h={20} v={hp} c={hp < 0.3 ? C.red : C.orange} bg="rgba(255,255,255,0.15)" />
					</div>
				</Col>
			</Row>
			<div style={{position: 'absolute', left: 120, top: 200, transform: `translateX(${hit * 40}px)`}}>
				<Avatar size={180} bg="linear-gradient(160deg,#FF8A3D,#FF3B30)" letter="T" />
			</div>
			<div style={{position: 'absolute', left: 480, top: 200 + ko * 60, transform: `rotate(${ko * 70}deg) translateX(${-hit * 20}px)`, opacity: 1 - ko * 0.4}}>
				<Avatar size={180} />
			</div>
			{hit > 0.3 && (
				<div style={{position: 'absolute', left: 390 - 70, top: 230, transform: `scale(${0.6 + hit}) rotate(${rand(Math.floor(sinceWord * 60)) * 30}deg)`}}>
					<svg viewBox="0 0 100 100" width={140} height={140}>
						<path d="M50 0 L60 35 L100 30 L68 55 L90 95 L50 70 L12 95 L32 56 L0 30 L40 35 Z" fill="#FFD60A" />
					</svg>
				</div>
			)}
			<div style={{position: 'absolute', left: 390, top: 470, transform: `translate(-50%,-50%) scale(${ko * (1.5 - 0.5 * ko)}) rotate(-6deg)`, opacity: ko}}>
				<T s={140} w={900} c="#FFD60A" style={{WebkitTextStroke: '6px #000', letterSpacing: '-0.04em'}}>K.O.</T>
			</div>
		</Card>
	);
};

const Suv: React.FC<{size: number; c?: string}> = ({size, c = '#15151A'}) => (
	<svg viewBox="0 0 300 130" width={size} height={(size * 130) / 300}>
		<path d="M14 92 L20 60 Q24 48 40 46 L70 44 L96 18 Q102 12 114 12 L214 12 Q226 12 234 22 L258 46 L280 50 Q292 54 292 68 L292 92 Z" fill={c} />
		<path d="M104 22 L84 44 L160 44 L160 22 Z M170 22 L170 44 L246 44 L226 24 Q222 22 214 22 Z" fill="#9FC3EA" opacity="0.8" />
		<circle cx="74" cy="96" r="26" fill="#0A0A0C" />
		<circle cx="74" cy="96" r="12" fill="#8E8E98" />
		<circle cx="236" cy="96" r="26" fill="#0A0A0C" />
		<circle cx="236" cy="96" r="12" fill="#8E8E98" />
		<rect x="270" y="58" width="18" height="8" rx="3" fill="#FFE45C" />
	</svg>
);

// new SUV: keys, engine start
const Car: React.FC<SceneProps> = ({p, t}) => {
	const start = p > 0.35;
	const rpm = start ? 0.35 + 0.15 * Math.abs(Math.sin(t * 7)) : 0;
	return (
		<Card y={30} h={640}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 320, background: 'linear-gradient(160deg,#EEF1F6,#D6DCE6)', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 60, height: 4, background: 'rgba(0,0,0,0.08)'}} />
				<div style={{position: 'absolute', left: 390 - 280, top: 60, transform: `translateY(${start ? Math.sin(t * 40) * 1.5 : 0}px)`}}>
					<Suv size={560} />
				</div>
			</div>
			<Abs x={40} y={350}>
				<Col gap={4}>
					<M>мой гараж · новый</M>
					<T s={52} w={800}>Тахо</T>
				</Col>
			</Abs>
			<Abs x={40} y={480} style={{width: 700}}>
				<Row gap={18}>
					<div style={{width: 120, height: 120, borderRadius: 60, background: start ? C.red : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: start ? `0 0 30px ${C.red}` : 'none'}}>
						<T s={22} w={800} c="#fff" style={{textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.1}}>{start ? 'ON' : 'START'}</T>
					</div>
					<Col gap={8} style={{flex: 1}}>
						<M s={22}>обороты</M>
						<Bar w={540} h={18} v={rpm} c={C.red} />
						<M s={22} c={C.green}>ничего не парит ✓</M>
					</Col>
				</Row>
			</Abs>
		</Card>
	);
};

// VIP pass at the club entrance
const Vip: React.FC<SceneProps> = ({p, t}) => {
	const ok = ramp(p, 0.45, 0.6, outBack);
	return (
		<Card y={20} w={620} h={660} style={{background: 'linear-gradient(160deg,#16121F,#2A1838)'}}>
			<div style={{position: 'absolute', inset: 0, background: `linear-gradient(${110 + Math.sin(t) * 20}deg, rgba(255,214,10,0) 30%, rgba(255,214,10,0.18) 50%, rgba(255,214,10,0) 70%)`}} />
			<Abs x={36} y={36}>
				<Pill bg="rgba(255,214,10,0.18)" c="#FFD60A" s={22}>CLUB · ВХОД</Pill>
			</Abs>
			<Col gap={6} style={{position: 'absolute', left: 0, right: 0, top: 120, alignItems: 'center'}}>
				<T s={120} w={900} c="#FFD60A" style={{letterSpacing: '-0.03em'}}>VIP</T>
				<T s={40} w={700} c="#fff">guest</T>
			</Col>
			<div style={{position: 'absolute', left: 36, right: 36, top: 360, borderTop: '3px dashed rgba(255,255,255,0.2)'}} />
			<Row gap={20} style={{position: 'absolute', left: 36, right: 36, top: 400}}>
				<Avatar size={110} letter="T" bg="linear-gradient(160deg,#FFD60A,#FF9F0A)" />
				<Col gap={4}>
					<T s={36} w={800} c="#fff">в списке</T>
					<M s={22} c="rgba(255,255,255,0.6)">все знают · стол 1</M>
				</Col>
			</Row>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center', transform: `scale(${ok})`}}>
				<Pill bg={C.green} s={30}>✓ проходи</Pill>
			</div>
		</Card>
	);
};

// speedometer
const Speed: React.FC<SceneProps> = ({p, t}) => {
	const v = interpolate(p, [0, 0.7], [0, 320], {...clamp, easing: outCubic}) + (p > 0.7 ? Math.sin(t * 9) * 3 : 0);
	const ang = -120 + (v / 340) * 240;
	return (
		<Card y={30} h={640} style={{background: 'linear-gradient(180deg,#1A1A22,#0C0C10)'}}>
			<div style={{position: 'absolute', left: 390 - 230, top: 50, width: 460, height: 460}}>
				<svg viewBox="0 0 200 200" width={460} height={460}>
					{Array.from({length: 18}).map((_, k) => {
						const a = ((-120 + (k / 17) * 240 - 90) * Math.PI) / 180;
						return <line key={k} x1={100 + Math.cos(a) * 80} y1={100 + Math.sin(a) * 80} x2={100 + Math.cos(a) * (k % 3 ? 86 : 90)} y2={100 + Math.sin(a) * (k % 3 ? 86 : 90)} stroke={k > 13 ? C.red : '#fff'} strokeWidth={k % 3 ? 1.5 : 3} />;
					})}
					<line x1="100" y1="100" x2={100 + Math.cos(((ang - 90) * Math.PI) / 180) * 74} y2={100 + Math.sin(((ang - 90) * Math.PI) / 180) * 74} stroke={C.red} strokeWidth="4" strokeLinecap="round" />
					<circle cx="100" cy="100" r="8" fill="#fff" />
				</svg>
				<Col gap={0} style={{position: 'absolute', left: 0, right: 0, top: 290, alignItems: 'center'}}>
					<T s={90} w={800} c="#fff" style={{fontVariantNumeric: 'tabular-nums'}}>{Math.round(v)}</T>
					<M s={24} c="rgba(255,255,255,0.6)">км/ч</M>
				</Col>
			</div>
			<Row style={{position: 'absolute', left: 40, right: 40, bottom: 40, justifyContent: 'space-between'}}>
				<Pill bg="rgba(255,59,48,0.2)" c={C.red} s={26}>Феррари</Pill>
				<Pill bg="rgba(255,255,255,0.12)" s={26}>передача {Math.min(7, 1 + Math.floor(p * 9))}</Pill>
			</Row>
		</Card>
	);
};

// radar: nobody sees us
const Radar: React.FC<SceneProps> = ({p, t}) => {
	const sweep = (t * 160) % 360;
	return (
		<Card y={30} h={640} style={{background: '#0A1A12'}}>
			<div style={{position: 'absolute', left: 390 - 240, top: 40, width: 480, height: 480, borderRadius: 240, overflow: 'hidden', background: 'radial-gradient(circle, #0F3A22 0%, #08180F 70%)'}}>
				{[1, 2, 3, 4].map((k) => (
					<div key={k} style={{position: 'absolute', left: 240 - k * 60, top: 240 - k * 60, width: k * 120, height: k * 120, borderRadius: '50%', border: '2px solid rgba(52,199,89,0.35)'}} />
				))}
				<div style={{position: 'absolute', left: 0, right: 0, top: 239, height: 2, background: 'rgba(52,199,89,0.3)'}} />
				<div style={{position: 'absolute', top: 0, bottom: 0, left: 239, width: 2, background: 'rgba(52,199,89,0.3)'}} />
				<div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${sweep}deg, rgba(52,199,89,0.55), rgba(52,199,89,0) 60deg, rgba(52,199,89,0) 360deg)`}} />
				{[0, 1, 2].map((k) => {
					const fade = Math.max(0, 1 - p * 2.2);
					return <div key={k} style={{position: 'absolute', left: 120 + rand(k) * 240, top: 120 + rand(k + 4) * 240, width: 16, height: 16, borderRadius: 8, background: C.green, opacity: fade}} />;
				})}
			</div>
			<Col gap={4} style={{position: 'absolute', left: 0, right: 0, bottom: 40, alignItems: 'center'}}>
				<T s={40} w={800} c={C.green}>целей: 0</T>
				<M s={24} c="rgba(52,199,89,0.7)">нас не видно</M>
			</Col>
		</Card>
	);
};

// back then: nobody cared
const Sleep: React.FC<SceneProps> = ({p, t}) => {
	const z = (k: number) => ((t * 0.8 + k * 0.33) % 1);
	return (
		<Card y={30} h={640}>
			<Abs x={40} y={36}>
				<Row gap={14}>
					<Icon bg="#5E5CE6" size={60}>☾</Icon>
					<Col gap={2}>
						<T s={36} w={800}>Тогда</T>
						<M>архив · 2019</M>
					</Col>
				</Row>
			</Abs>
			<Row gap={24} style={{position: 'absolute', left: 40, top: 160}}>
				<Avatar size={150} letter="T" bg="linear-gradient(160deg,#B8BDCB,#8E94A6)" />
				<Col gap={8}>
					<T s={40} w={800} c={C.sub}>Toxi$</T>
					<Row gap={26}>
						{[
							['12', 'подписчиков'],
							['0', 'лайков'],
						].map(([n, l]) => (
							<Col key={l} gap={0}>
								<T s={40} w={800} c={C.sub}>{n}</T>
								<M s={20}>{l}</M>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
			{[0, 1, 2].map((k) => (
				<div key={k} style={{position: 'absolute', left: 560 + z(k) * 80, top: 200 - z(k) * 120, opacity: 1 - z(k)}}>
					<T s={40 + k * 10} w={800} c="#5E5CE6">z</T>
				</div>
			))}
			<Abs x={40} y={400} style={{width: 700}}>
				<Col gap={14}>
					{['«не выстрелит»', '«займись делом»', 'прочитано, без ответа'].map((q, k) => (
						<div key={q} style={{opacity: ramp(p, k * 0.2, k * 0.2 + 0.15), background: C.fill, borderRadius: 20, padding: '14px 22px', alignSelf: 'flex-start'}}>
							<T s={28} w={600} c={C.sub}>{q}</T>
						</div>
					))}
				</Col>
			</Abs>
		</Card>
	);
};

// now: look at us
const Glowup: React.FC<SceneProps> = ({p}) => {
	const f = interpolate(p, [0, 0.8], [12, 2400000], {...clamp, easing: outCubic});
	const l = interpolate(p, [0, 0.8], [0, 18700000], {...clamp, easing: outCubic});
	const pts = Array.from({length: 24}).map((_, k) => [k * 30, 170 - Math.pow(k / 23, 2.2) * 160]);
	const shown = Math.max(2, Math.floor(pts.length * Math.min(1, p * 1.2)));
	return (
		<Card y={30} h={640}>
			<Abs x={40} y={36}>
				<Row gap={14}>
					<Icon bg={C.orange} size={60}>☀</Icon>
					<Col gap={2}>
						<T s={36} w={800}>Теперь</T>
						<M>2026 · B Soul</M>
					</Col>
				</Row>
			</Abs>
			<Row gap={24} style={{position: 'absolute', left: 40, top: 160}}>
				<Avatar size={150} letter="T" bg="linear-gradient(160deg,#FF8A3D,#FF3B30)" />
				<Col gap={8}>
					<Row gap={10}>
						<T s={40} w={800}>Toxi$</T>
						<div style={{width: 36, height: 36, borderRadius: 18, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<T s={22} c="#fff">✓</T>
						</div>
					</Row>
					<Row gap={26}>
						{[
							[fmt(f), 'подписчиков'],
							[fmt(l), 'лайков'],
						].map(([n, lab]) => (
							<Col key={lab} gap={0}>
								<T s={40} w={800} style={{fontVariantNumeric: 'tabular-nums'}}>{n}</T>
								<M s={20}>{lab}</M>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
			<svg width={700} height={190} style={{position: 'absolute', left: 40, top: 400}}>
				<polyline points={pts.slice(0, shown).map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={C.green} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
				<circle cx={pts[shown - 1][0]} cy={pts[shown - 1][1]} r="12" fill={C.green} stroke="#fff" strokeWidth="5" />
			</svg>
		</Card>
	);
};

export const RN_SCENES: Record<string, React.FC<SceneProps>> = {
	calendar: Calendar,
	todo: Todo,
	tv: Tv,
	stop: Stop,
	blocked: Blocked,
	ko: Ko,
	car: Car,
	vip: Vip,
	speed: Speed,
	radar: Radar,
	sleep: Sleep,
	glowup: Glowup,
};

export const RN_CONFETTI: Record<string, number> = {tv: 0.58, vip: 0.5, glowup: 0.75};

export {Check};
