import React from 'react';
import {interpolate} from 'remotion';
import {C, FONT, MONO, rand} from '../theme';
import {Abs, Avatar, Bar, Card, Check, clamp, Col, Icon, M, outBack, outCubic, Pill, ramp, Row, SceneProps, T, Waveform} from './ui';

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ');
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('ru-RU') + s.slice(1);

// 1. Screen time + alert
const Alert: React.FC<SceneProps> = ({s, p, wi, sinceWord}) => {
	const bars = [0.35, 0.5, 0.42, 0.7, 0.55, 0.9, 1];
	const a = ramp(s, 0.15, 0.45, outBack);
	const harm = wi >= 3;
	const shake = harm ? Math.sin(sinceWord * 70) * 10 * Math.exp(-sinceWord * 8) : 0;
	return (
		<>
			<Card y={0} h={430}>
				<Abs x={44} y={40}>
					<Row gap={18}>
						<Icon bg={C.purple} size={64}>⌛</Icon>
						<Col gap={2}>
							<T s={34} w={800}>Экранное время</T>
							<M>сегодня · madk1d</M>
						</Col>
					</Row>
				</Abs>
				<Abs x={44} y={150}>
					<T s={78} w={800} style={{fontVariantNumeric: 'tabular-nums'}}>
						{Math.floor(3 + p * 6)} ч {String(Math.floor((p * 3517) % 60)).padStart(2, '0')} мин
					</T>
				</Abs>
				<Abs x={44} y={260}>
					<Row gap={22} style={{alignItems: 'flex-end', height: 130}}>
						{bars.map((v, k) => (
							<div key={k} style={{width: 74, height: 130 * v * ramp(s, k * 0.05, 0.4 + k * 0.05), borderRadius: 12, background: k === 6 ? C.red : '#C7C7CC'}} />
						))}
					</Row>
				</Abs>
			</Card>
			<div style={{position: 'absolute', left: 496 - 300, top: 330, transform: `translateX(${shake}px) scale(${a})`, opacity: a}}>
				<div style={{width: 600, borderRadius: 36, background: 'rgba(250,250,252,0.96)', boxShadow: '0 30px 70px rgba(40,20,80,0.25)', overflow: 'hidden'}}>
					<Col gap={10} style={{padding: '34px 40px 28px', alignItems: 'center'}}>
						<Icon bg={harm ? C.red : C.orange} size={70}>!</Icon>
						<T s={36} w={800}>Лимит превышен</T>
						<T s={28} w={500} c={C.sub}>
							это <span style={{color: harm ? C.red : C.sub, fontWeight: 800}}>вред</span>
						</T>
					</Col>
					<Row gap={0} style={{borderTop: `2px solid ${C.line}`}}>
						<div style={{flex: 1, textAlign: 'center', padding: '22px 0', borderRight: `2px solid ${C.line}`}}>
							<T s={30} w={800} c={C.blue}>Перестань</T>
						</div>
						<div style={{flex: 1, textAlign: 'center', padding: '22px 0'}}>
							<T s={30} w={500} c={C.blue}>Ещё 15 минут</T>
						</div>
					</Row>
				</div>
			</div>
		</>
	);
};

const Hoodie: React.FC<{size: number}> = ({size}) => (
	<svg viewBox="0 0 200 200" width={size} height={size}>
		<path d="M70 30 Q100 55 130 30 L165 48 L190 120 L160 128 L152 100 L152 185 L48 185 L48 100 L40 128 L10 120 L35 48 Z" fill="#18181C" />
		<path d="M70 30 Q100 70 130 30" fill="none" stroke="#33333A" strokeWidth="8" />
		<path d="M88 52 L86 90 M112 52 L114 90" stroke="#55555E" strokeWidth="4" strokeLinecap="round" />
		<rect x="70" y="120" width="60" height="34" rx="6" fill="#26262C" />
	</svg>
);

// 2. Shop: search, product, hide in cart
const Shop: React.FC<SceneProps> = ({s, p, wi}) => {
	const q = 'кав эмпт';
	const typed = q.slice(0, Math.ceil(ramp(s, 0.05, 0.6, (x) => x) * q.length));
	const done = wi >= 4;
	const d = done ? ramp(p, 0.75, 0.85, outBack) : 0;
	return (
		<>
			<Card y={0} h={100} r={50}>
				<Row gap={18} style={{padding: '0 34px', height: 100}}>
					<T s={36} c={C.sub}>⌕</T>
					<T s={34} w={600}>
						{typed}
						<span style={{color: C.blue, opacity: Math.floor(s * 3) % 2 ? 0 : 1}}>|</span>
					</T>
				</Row>
			</Card>
			<Card y={130} h={540}>
				<div style={{position: 'absolute', left: 24, top: 24, width: 300, height: 360, borderRadius: 30, background: 'linear-gradient(160deg,#F1F1F5,#DADAE2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{transform: `rotate(${Math.sin(s * 2) * 3}deg)`}}>
						<Hoodie size={270} />
					</div>
				</div>
				<Abs x={360} y={40}>
					<Col gap={8}>
						<M>архив · ss/26</M>
						<T s={44} w={800}>Кав Эмпт</T>
						<T s={30} w={500} c={C.sub}>худи, чёрный, L</T>
						<T s={48} w={800} style={{marginTop: 18}}>24 900 ₽</T>
					</Col>
				</Abs>
				<Abs x={360} y={300}>
					<Row gap={10}>
						{['S', 'M', 'L', 'XL'].map((z) => (
							<div key={z} style={{width: 74, height: 64, borderRadius: 16, border: `3px solid ${z === 'L' ? C.ink : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<T s={26} w={700}>{z}</T>
							</div>
						))}
					</Row>
				</Abs>
				<Abs x={24} y={414}>
					<div style={{width: 732, height: 100, borderRadius: 26, background: done ? C.green : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.05 * Math.sin(d * Math.PI)})`}}>
						<T s={36} w={800} c="#fff">{done ? '✓ Спрятано' : 'В корзину'}</T>
					</div>
				</Abs>
			</Card>
			<div style={{position: 'absolute', left: 820, top: 110, transform: `scale(${d})`}}>
				<div style={{width: 64, height: 64, borderRadius: 32, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(255,59,48,0.4)'}}>
					<T s={32} w={800} c="#fff">1</T>
				</div>
			</div>
		</>
	);
};

// 3. Family: dad sinks under the ground, mom rises to the sky
const Family: React.FC<SceneProps> = ({p, t}) => {
	const e = outCubic(Math.min(1, p * 1.1));
	const ground = 470;
	const dadY = interpolate(e, [0, 1], [ground - 150, ground + 30]);
	const momY = interpolate(Math.max(0, (p - 0.35) / 0.65), [0, 1], [ground - 150, 70], {...clamp, easing: outCubic});
	return (
		<Card y={0} h={690}>
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#CFE6FF 0%,#F4F9FF 60%,#fff 68%)'}} />
			{[0, 1, 2].map((k) => (
				<div
					key={k}
					style={{
						position: 'absolute',
						left: ((k * 290 + t * 30) % 900) - 120,
						top: 40 + k * 60,
						width: 180,
						height: 60,
						borderRadius: 30,
						background: '#fff',
						opacity: 0.9,
						boxShadow: '40px -18px 0 -6px #fff, 80px 0 0 -10px #fff',
					}}
				/>
			))}
			<Abs x={30} y={24}>
				<Pill bg="rgba(255,255,255,0.85)" c={C.ink} s={24}>Семья · 2 контакта</Pill>
			</Abs>
			{/* mom */}
			<div style={{position: 'absolute', left: 470, top: momY, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
				<Avatar size={130} bg="linear-gradient(160deg,#FFB3D4,#FF6FA8)" />
				<Pill bg="#fff" c={C.ink} s={24}>Мама · ↑ в сети</Pill>
			</div>
			{/* ground */}
			<div style={{position: 'absolute', left: 0, right: 0, top: ground, bottom: 0, background: 'linear-gradient(180deg,#B9A58E,#8C7A66)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: ground, height: 10, background: '#7FBF6A'}} />
			{/* dad clipped by the ground */}
			<div style={{position: 'absolute', left: 0, top: 0, width: 780, height: ground, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 120, top: dadY, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<Avatar size={130} dark />
					<Pill bg="#fff" c={C.ink} s={24}>Папа · был давно</Pill>
				</div>
			</div>
			<Abs x={30} y={ground + 40}>
				<M c="rgba(255,255,255,0.9)" s={24}>
					глубина: −{(e * 2).toFixed(2)} м
				</M>
			</Abs>
			<Abs x={470} y={ground + 40}>
				<M c="rgba(255,255,255,0.9)" s={24}>
					высота: +{(Math.max(0, p - 0.35) * 1500).toFixed(0)} м
				</M>
			</Abs>
		</Card>
	);
};

// 4. Find-my style map
const MapScene: React.FC<SceneProps> = ({p, t}) => {
	const route = 'M 90 470 C 180 400, 210 300, 330 310 S 480 190, 530 240 S 630 150, 670 130';
	const L = 900;
	return (
		<Card y={0} h={690}>
			<svg width={780} height={690} viewBox="0 0 780 690" style={{position: 'absolute', inset: 0}}>
				<rect width="780" height="690" fill="#F3F1EC" />
				<rect x="460" y="340" width="320" height="200" fill="#CFE3FA" />
				<rect x="80" y="70" width="150" height="100" rx="14" fill="#D6EBCB" />
				<rect x="300" y="420" width="110" height="80" rx="14" fill="#D6EBCB" />
				{['M -20 200 L 800 140', 'M -20 360 L 800 400', 'M 260 -20 L 210 560', 'M 580 -20 L 620 560', 'M -20 520 L 430 20'].map((d) => (
					<path key={d} d={d} stroke="#fff" strokeWidth="24" fill="none" />
				))}
				<path d={route} stroke={C.blue} strokeOpacity={0.2} strokeWidth="14" fill="none" strokeLinecap="round" />
				<path d={route} stroke={C.blue} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - Math.min(1, p * 1.2))} />
			</svg>
			{/* me */}
			<div style={{position: 'absolute', left: 90 - 60, top: 470 - 60, width: 120, height: 120, borderRadius: 60, background: 'rgba(10,132,255,0.18)', transform: `scale(${0.6 + 0.4 * ((t * 1.5) % 1)})`, opacity: 1 - ((t * 1.5) % 1)}} />
			<div style={{position: 'absolute', left: 90 - 18, top: 470 - 18, width: 36, height: 36, borderRadius: 18, background: C.blue, border: '6px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)'}} />
			{/* her: unknown */}
			<div style={{position: 'absolute', left: 670 - 46, top: 130 - 120, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{width: 92, height: 92, borderRadius: 46, background: '#fff', padding: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.2)'}}>
					<Avatar size={80} dark letter="?" />
				</div>
				<div style={{width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '20px solid #fff'}} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'rgba(255,255,255,0.96)', borderTop: `2px solid ${C.line}`}}>
				<Row gap={18} style={{padding: '26px 34px'}}>
					<Avatar size={90} dark letter="?" />
					<Col gap={4}>
						<T s={34} w={800}>где-то</T>
						<M s={24}>геопозиция скрыта · {Math.floor(p * 9)} мин назад</M>
					</Col>
				</Row>
			</div>
		</Card>
	);
};

// 5. Chat: no answer, she is with someone
const Chat: React.FC<SceneProps> = ({s, p, t}) => {
	const b1 = ramp(s, 0.05, 0.25, outBack);
	const b2 = ramp(s, 0.35, 0.55, outBack);
	const typing = p > 0.45;
	const read = p > 0.75;
	return (
		<Card y={0} h={690} style={{background: '#F7F7FA'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'rgba(255,255,255,0.95)', borderBottom: `2px solid ${C.line}`}}>
				<Row gap={18} style={{padding: '22px 30px'}}>
					<T s={44} c={C.blue}>‹</T>
					<Avatar size={76} dark />
					<Col gap={2}>
						<T s={32} w={800}>Она</T>
						<M s={22} c={typing ? C.blue : C.sub}>{typing ? 'печатает…' : 'была недавно'}</M>
					</Col>
				</Row>
			</div>
			<Abs x={0} y={150} style={{width: 780}}>
				<Col gap={18} style={{alignItems: 'flex-end', padding: '0 30px'}}>
					<div style={{transform: `scale(${b1})`, transformOrigin: 'right bottom'}}>
						<Pill bg={C.blue} s={32} style={{borderRadius: 30}}>ты где?</Pill>
					</div>
					<div style={{transform: `scale(${b2})`, transformOrigin: 'right bottom'}}>
						<Pill bg={C.blue} s={32} style={{borderRadius: 30}}>с кем ты?</Pill>
					</div>
					<M s={22} c={read ? C.blue : C.sub}>{read ? 'прочитано ✓✓' : 'доставлено ✓'}</M>
				</Col>
			</Abs>
			{typing && (
				<Abs x={30} y={440}>
					<div style={{background: '#E9E9EF', borderRadius: 30, padding: '24px 30px', display: 'flex', gap: 12}}>
						{[0, 1, 2].map((k) => (
							<div key={k} style={{width: 20, height: 20, borderRadius: 10, background: '#9A9AA2', transform: `translateY(${-Math.max(0, Math.sin(t * 10 - k * 0.9)) * 12}px)`}} />
						))}
					</div>
				</Abs>
			)}
			<div style={{position: 'absolute', left: 24, right: 24, bottom: 24, height: 80, borderRadius: 40, background: '#fff', border: `2px solid ${C.line}`}}>
				<Row style={{height: 80, padding: '0 28px'}}>
					<T s={28} w={500} c={C.sub}>Сообщение</T>
				</Row>
			</div>
		</Card>
	);
};

// 6. Calling, no answer
const Call: React.FC<SceneProps> = ({s, p, t}) => {
	const fail = p > 0.62;
	const ring = (t * 1.2) % 1;
	return (
		<Card y={0} h={690} style={{background: 'linear-gradient(180deg,#2B2B35,#121218)'}}>
			<Col gap={10} style={{alignItems: 'center', paddingTop: 70}}>
				<div style={{position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					{!fail &&
						[0, 0.5].map((o) => {
							const r = (ring + o) % 1;
							return <div key={o} style={{position: 'absolute', inset: 0, borderRadius: 110, border: '4px solid rgba(255,255,255,0.5)', transform: `scale(${1 + r * 0.6})`, opacity: 1 - r}} />;
						})}
					<Avatar size={200} bg="linear-gradient(160deg,#6E6E7A,#3A3A44)" />
				</div>
				<T s={52} w={800} c="#fff" style={{marginTop: 18}}>Она</T>
				<T s={32} w={500} c={fail ? C.red : 'rgba(255,255,255,0.7)'}>{fail ? 'Нет ответа' : `вызов… ${mmss(s)}`}</T>
			</Col>
			<Row gap={90} style={{position: 'absolute', left: 0, right: 0, bottom: 70, justifyContent: 'center'}}>
				<Col gap={10} style={{alignItems: 'center'}}>
					<div style={{width: 110, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={44} c="#fff">♪</T>
					</div>
					<M s={20} c="rgba(255,255,255,0.7)">звук</M>
				</Col>
				<Col gap={10} style={{alignItems: 'center'}}>
					<div style={{width: 110, height: 110, borderRadius: 55, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${fail ? 1 + 0.08 * Math.sin(t * 12) : 1})`}}>
						<T s={50} c="#fff" style={{transform: 'rotate(135deg)', display: 'inline-block'}}>✆</T>
					</div>
					<M s={20} c="rgba(255,255,255,0.7)">завершить</M>
				</Col>
			</Row>
		</Card>
	);
};

const HeartIcon: React.FC<{size: number; split: number}> = ({size, split}) => {
	const d = 'M50 88 C20 66 4 48 4 30 C4 16 15 6 28 6 C38 6 46 12 50 20 C54 12 62 6 72 6 C85 6 96 16 96 30 C96 48 80 66 50 88 Z';
	return (
		<svg viewBox="-20 -10 140 120" width={size} height={size}>
			<clipPath id="hl">
				<path d="M-20 -10 H50 L44 30 L56 46 L46 62 L52 110 H-20 Z" />
			</clipPath>
			<clipPath id="hr">
				<path d="M50 -10 H120 V110 H52 L46 62 L56 46 L44 30 Z" />
			</clipPath>
			<g transform={`translate(${-14 * split} ${10 * split}) rotate(${-14 * split} 50 50)`}>
				<path d={d} fill={C.red} clipPath="url(#hl)" />
			</g>
			<g transform={`translate(${14 * split} ${14 * split}) rotate(${14 * split} 50 50)`}>
				<path d={d} fill={C.red} clipPath="url(#hr)" />
			</g>
		</svg>
	);
};

// 7. Character card: HP drains, K.O.
const Heart: React.FC<SceneProps> = ({p, s, sinceWord}) => {
	const hp = interpolate(p, [0.05, 0.6], [1, 0], {...clamp, easing: outCubic});
	const ko = ramp(p, 0.6, 0.7, outBack);
	const split = ramp(p, 0.55, 0.75, outBack);
	return (
		<Card y={0} h={640}>
			<Abs x={40} y={40}>
				<Row gap={22}>
					<div style={{width: 150, height: 150, borderRadius: 40, background: 'linear-gradient(160deg,#3B1F4A,#120814)', position: 'relative', overflow: 'hidden'}}>
						<svg viewBox="0 0 100 100" width={150} height={150}>
							<path d="M22 100 C24 66 76 66 78 100 Z" fill="#2A1236" />
							<circle cx="50" cy="44" r="22" fill="#E9D9EE" />
							<path d="M28 40 L50 18 L72 40 Q50 30 28 40 Z" fill="#120814" />
							<circle cx="42" cy="46" r="3.5" fill={C.red} />
							<circle cx="58" cy="46" r="3.5" fill={C.red} />
							<path d="M45 56 L47 61 L49 56 M51 56 L53 61 L55 56" stroke="#fff" strokeWidth="1.6" fill="none" />
						</svg>
					</div>
					<Col gap={6}>
						<M>персонаж · ур. 26</M>
						<T s={48} w={800}>рил вэмп</T>
						<Row gap={8}>
							<Pill bg="#F3E8FF" c={C.purple} s={22}>ночь</Pill>
							<Pill bg="#FFE8E8" c={C.red} s={22}>укусы ×99</Pill>
						</Row>
					</Col>
				</Row>
			</Abs>
			<Abs x={40} y={240}>
				<Row gap={16}>
					<T s={30} w={800} c={C.red}>HP</T>
					<Bar w={560} h={28} v={hp} c={hp < 0.3 ? C.red : C.green} />
					<M s={24} c={C.ink}>{Math.round(hp * 100)}</M>
				</Row>
			</Abs>
			<div style={{position: 'absolute', left: 390 - 130, top: 300, transform: `scale(${1 + 0.1 * Math.exp(-sinceWord * 9)})`}}>
				<HeartIcon size={260} split={split} />
			</div>
			<div style={{position: 'absolute', left: 390, top: 430, transform: `translate(-50%,-50%) rotate(-10deg) scale(${ko * (1.4 - 0.4 * ko)})`, opacity: ko}}>
				<div style={{border: `8px solid ${C.red}`, borderRadius: 18, padding: '6px 26px', background: 'rgba(255,255,255,0.85)'}}>
					<T s={64} w={900} c={C.red}>ТЫ УБИЛА</T>
				</div>
			</div>
			<Abs x={40} y={580}>
				<M>{s.toFixed(1)} c · урон: критический</M>
			</Abs>
		</Card>
	);
};

const Gamepad: React.FC<{size: number; c: string}> = ({size, c}) => (
	<svg viewBox="0 0 120 80" width={size} height={(size * 80) / 120}>
		<path d="M30 10 H90 C108 10 118 30 118 50 C118 66 110 76 100 76 C90 76 84 64 76 58 H44 C36 64 30 76 20 76 C10 76 2 66 2 50 C2 30 12 10 30 10 Z" fill={c} />
		<path d="M30 32 V50 M21 41 H39" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
		<circle cx="84" cy="36" r="6" fill="#fff" />
		<circle cx="96" cy="47" r="6" fill="#fff" />
	</svg>
);

// 8. Game stuck at 60 %
const Game: React.FC<SceneProps> = ({p, t, sinceWord}) => {
	const prog = interpolate(p, [0, 0.6], [0.05, 0.6], {...clamp, easing: outCubic});
	const paused = p > 0.6;
	return (
		<Card y={0} h={660}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 780, height: 330, background: 'linear-gradient(135deg,#1C1C28 0%,#3A1D5C 55%,#0A84FF 120%)', overflow: 'hidden'}}>
				{Array.from({length: 18}).map((_, k) => (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: rand(k) * 780,
							top: ((rand(k + 9) * 330 + t * (20 + rand(k + 3) * 40)) % 360) - 20,
							width: 6 + rand(k + 1) * 10,
							height: 6 + rand(k + 1) * 10,
							borderRadius: 4,
							background: k % 3 ? 'rgba(255,255,255,0.5)' : C.pink,
						}}
					/>
				))}
				<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', transform: `scale(${1 + 0.08 * Math.exp(-sinceWord * 10)})`}}>
					<Gamepad size={230} c="rgba(255,255,255,0.95)" />
				</div>
				{paused && (
					<div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={70} w={900} c="#fff">❚❚</T>
					</div>
				)}
			</div>
			<Abs x={40} y={360}>
				<Col gap={6}>
					<M>сохранение · madk1d</M>
					<T s={56} w={900}>ИГРА</T>
				</Col>
			</Abs>
			<Abs x={40} y={500}>
				<Row gap={16}>
					<Bar w={590} h={18} v={prog} />
					<M s={24} c={C.blue}>{Math.round(prog * 100)}%</M>
				</Row>
			</Abs>
			<Abs x={40} y={550}>
				<Pill bg={paused ? C.ink : C.blue} s={30}>{paused ? '❚❚ Пауза' : '▶ Играть'}</Pill>
			</Abs>
		</Card>
	);
};

// 9. Lock-screen notifications, one per word
const Notify: React.FC<SceneProps> = ({wi, sinceWord, word, s}) => {
	const items = Array.from({length: wi + 1}).map((_, k) => k);
	return (
		<>
			<Abs x={0} y={0} style={{width: 992, textAlign: 'center'}}>
				<T s={120} w={300} c="rgba(11,11,16,0.85)" style={{fontVariantNumeric: 'tabular-nums'}}>
					0:{String(16 + Math.floor(s)).padStart(2, '0')}
				</T>
			</Abs>
			{items.map((k) => {
				const newest = k === wi;
				const a = newest ? ramp(sinceWord, 0, 0.22, outBack) : 1;
				const depth = wi - k;
				return (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: 496 - 370,
							top: 190 + Math.min(depth, 3) * -0 + (wi - depth) * 0 + 140 * Math.min(k, 3),
							width: 740,
							transform: `scale(${a})`,
							opacity: a,
						}}
					>
						<div style={{borderRadius: 34, background: 'rgba(255,255,255,0.82)', boxShadow: '0 16px 40px rgba(40,20,80,0.15)', padding: '22px 26px'}}>
							<Row gap={18}>
								<Icon bg={C.green} size={64}>✉</Icon>
								<Col gap={2} style={{flex: 1}}>
									<Row style={{justifyContent: 'space-between'}}>
										<T s={28} w={800}>madk1d</T>
										<M s={20}>сейчас</M>
									</Row>
									<T s={32} w={500}>{newest ? cap(word) : ['Но', 'сорян', 'не могу'][k] ?? '…'}</T>
								</Col>
							</Row>
						</div>
					</div>
				);
			})}
		</>
	);
};

// 10. Storage: clear everything
const Storage: React.FC<SceneProps> = ({p, wi}) => {
	const rows = [
		{n: 'Дешёвое', sz: '12,4 ГБ', c: C.orange, at: 4},
		{n: 'Тупое', sz: '8,9 ГБ', c: C.purple, at: 5},
		{n: 'Всё своё', sz: '31,7 ГБ', c: C.pink, at: 3},
	];
	const cleared = p > 0.85;
	return (
		<Card y={0} h={680}>
			<Abs x={40} y={40}>
				<Col gap={4}>
					<T s={44} w={800}>Хранилище</T>
					<M>занято {cleared ? '1,2' : '53,0'} ГБ из 128 ГБ</M>
				</Col>
			</Abs>
			<Abs x={40} y={170}>
				<Row gap={4} style={{width: 700, height: 34, borderRadius: 12, overflow: 'hidden', background: C.fill}}>
					{rows.map((r, k) => {
						const gone = wi >= r.at;
						return <div key={k} style={{height: '100%', width: gone ? 0 : [140, 100, 300][k], background: r.c, transition: 'none'}} />;
					})}
				</Row>
			</Abs>
			<Abs x={40} y={240} style={{width: 700}}>
				<Col gap={0}>
					{rows.map((r, k) => {
						const gone = wi >= r.at;
						return (
							<Row key={k} gap={18} style={{padding: '18px 0', borderBottom: `2px solid ${C.line}`, opacity: gone ? 0.35 : 1}}>
								<Icon bg={r.c} size={60}>▤</Icon>
								<T s={32} w={700} style={{flex: 1, textDecoration: gone ? 'line-through' : 'none'}}>{r.n}</T>
								<M s={24} c={gone ? C.red : C.sub}>{gone ? 'удалено' : r.sz}</M>
							</Row>
						);
					})}
				</Col>
			</Abs>
			<Abs x={40} y={560}>
				<div style={{width: 700, height: 90, borderRadius: 24, background: cleared ? C.green : '#FFE9E8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<T s={34} w={800} c={cleared ? '#fff' : C.red}>{cleared ? '✓ Очищено' : 'Очистить всё'}</T>
				</div>
			</Abs>
		</Card>
	);
};

// 11. Timer ring
const Timer: React.FC<SceneProps> = ({p, s}) => {
	const R = 210;
	const len = 2 * Math.PI * R;
	const left = 5 * 365 * 24 * 3600 - s * 3600 * 24 * 30;
	const y = Math.floor(left / (365 * 24 * 3600));
	const d = Math.floor((left % (365 * 24 * 3600)) / 86400);
	return (
		<Card y={0} h={680}>
			<Abs x={40} y={36}>
				<Row gap={14}>
					<Icon bg={C.orange} size={56}>⏱</Icon>
					<T s={36} w={800}>Срок</T>
				</Row>
			</Abs>
			<div style={{position: 'absolute', left: 390 - R - 20, top: 120}}>
				<svg width={2 * R + 40} height={2 * R + 40}>
					<circle cx={R + 20} cy={R + 20} r={R} stroke={C.fill} strokeWidth="26" fill="none" />
					<circle cx={R + 20} cy={R + 20} r={R} stroke={C.orange} strokeWidth="26" fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * p * 0.9} transform={`rotate(-90 ${R + 20} ${R + 20})`} />
				</svg>
				<Col gap={4} style={{position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center'}}>
					<T s={76} w={300} style={{fontVariantNumeric: 'tabular-nums'}}>{y} г {String(d).padStart(3, '0')} д</T>
					<M s={24}>придётся отсидеть</M>
				</Col>
			</div>
			<Row style={{position: 'absolute', left: 40, right: 40, bottom: 36, justifyContent: 'space-between'}}>
				<Pill bg={C.fill} c={C.ink} s={28}>Отмена</Pill>
				<Pill bg="#FFF1DC" c={C.orange} s={28}>Пауза</Pill>
			</Row>
		</Card>
	);
};

// 12. Voice memo recording
const Voice: React.FC<SceneProps> = ({s, rms, t}) => (
	<Card y={0} h={600}>
		<Abs x={40} y={36}>
			<Row style={{width: 700, justifyContent: 'space-between'}}>
				<T s={40} w={800}>Новая запись</T>
				<T s={30} w={600} c={C.blue}>Готово</T>
			</Row>
		</Abs>
		<Abs x={40} y={110}>
			<Pill bg={C.fill} c={C.sub} s={24}>🎙 ответ братану</Pill>
		</Abs>
		<Abs x={40} y={190}>
			<div style={{position: 'relative'}}>
				<Waveform bars={46} w={700} h={170} rms={rms} />
				<div style={{position: 'absolute', right: 0, top: -10, width: 4, height: 190, background: C.red, borderRadius: 2}} />
			</div>
		</Abs>
		<Abs x={0} y={390} style={{width: 780, textAlign: 'center'}}>
			<T s={72} w={700} style={{fontVariantNumeric: 'tabular-nums'}}>0:0{Math.floor(s)},{Math.floor((s % 1) * 10)}</T>
		</Abs>
		<div style={{position: 'absolute', left: 390 - 50, top: 490, width: 100, height: 100, borderRadius: 50, border: `5px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{width: 40, height: 40, borderRadius: 10, background: C.red, transform: `scale(${0.9 + 0.1 * Math.sin(t * 6)})`}} />
		</div>
	</Card>
);

// 13. Wallet: balance up, +24 300 on every word
const Wallet: React.FC<SceneProps> = ({p, sinceWord, s}) => {
	const bal = interpolate(p, [0, 0.9], [0, 98400], {...clamp, easing: outCubic});
	const chip = ramp(sinceWord, 0, 0.15, outBack) * interpolate(sinceWord, [0.5, 0.7], [1, 0.85], clamp);
	const toast = ramp(s, 0.3, 0.5, outBack);
	const pts = Array.from({length: 24}).map((_, k) => [k * 30, 160 - Math.pow(k / 23, 1.6) * 140 - Math.sin(k * 1.3) * 10]);
	const shown = Math.max(2, Math.floor(pts.length * Math.min(1, p * 1.15)));
	return (
		<>
			<div style={{position: 'absolute', left: 496 - 210, top: 0, transform: `translateY(${(1 - toast) * -40}px) scale(${toast})`, opacity: toast}}>
				<Pill bg="rgba(255,255,255,0.95)" c={C.ink} s={30} style={{boxShadow: '0 14px 30px rgba(40,20,80,0.15)'}}>
					<span style={{color: C.green}}>✓</span> Перевод получен
				</Pill>
			</div>
			<Card y={100} h={560}>
				<Abs x={40} y={40}>
					<Row gap={14}>
						<Icon bg={C.green} size={58}>₽</Icon>
						<T s={32} w={700}>Баланс</T>
					</Row>
				</Abs>
				<Abs x={40} y={130}>
					<T s={104} w={800} style={{fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em'}}>{fmt(bal)} ₽</T>
				</Abs>
				<div style={{position: 'absolute', left: 40, top: 270, transform: `scale(${chip})`, transformOrigin: 'left center'}}>
					<Pill bg="#E3F8E9" c={C.green} s={32}>+ 24 300 ₽</Pill>
				</div>
				<svg width={700} height={180} style={{position: 'absolute', left: 40, top: 350}}>
					<polyline points={pts.slice(0, shown).map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={C.green} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
					<circle cx={pts[shown - 1][0]} cy={pts[shown - 1][1]} r="12" fill={C.green} stroke="#fff" strokeWidth="5" />
				</svg>
			</Card>
		</>
	);
};

// 14. Payment sheet
const Pay: React.FC<SceneProps> = ({p, t}) => {
	const ok = ramp(p, 0.45, 0.6, outCubic);
	const spin = p > 0.2 && p < 0.45;
	return (
		<Card y={60} h={600} r={56}>
			<Abs x={40} y={36}>
				<Row style={{width: 700, justifyContent: 'space-between'}}>
					<T s={36} w={800}>Оплата</T>
					<div style={{width: 52, height: 52, borderRadius: 26, background: C.fill, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={26} c={C.sub}>✕</T>
					</div>
				</Row>
			</Abs>
			<Abs x={40} y={120} style={{width: 700}}>
				<Row gap={18} style={{padding: '18px 0', borderBottom: `2px solid ${C.line}`}}>
					<Icon bg={C.ink} size={70}>P</Icon>
					<Col gap={2} style={{flex: 1}}>
						<T s={32} w={800}>Продукт</T>
						<M>madk1d · 1 шт.</M>
					</Col>
					<T s={34} w={800}>24 300 ₽</T>
				</Row>
			</Abs>
			<div style={{position: 'absolute', left: 0, right: 0, top: 270, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				{ok > 0 ? (
					<Check size={180} p={ok} />
				) : (
					<div style={{width: 120, height: 120, borderRadius: 60, border: `10px solid ${C.fill}`, borderTopColor: spin ? C.blue : C.fill, transform: `rotate(${t * 720}deg)`}} />
				)}
			</div>
			<Abs x={0} y={500} style={{width: 780, textAlign: 'center'}}>
				<T s={34} w={700} c={ok > 0 ? C.green : C.sub}>{ok > 0 ? 'Готово' : spin ? 'Обработка…' : 'Подтвердите оплату'}</T>
			</Abs>
		</Card>
	);
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
	alert: Alert,
	shop: Shop,
	family: Family,
	map: MapScene,
	chat: Chat,
	call: Call,
	heart: Heart,
	game: Game,
	notify: Notify,
	storage: Storage,
	timer: Timer,
	voice: Voice,
	wallet: Wallet,
	pay: Pay,
};

// moments worth a confetti burst, relative to scene start (fraction of duration)
export const CONFETTI_AT: Record<string, number> = {shop: 0.78, wallet: 0.05, pay: 0.48, storage: 0.86};

export {FONT, MONO};
