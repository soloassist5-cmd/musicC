import React from 'react';
import {interpolate} from 'remotion';
import {C, rand} from '../theme';
import {Abs, Avatar, Bar, Card, clamp, Col, Icon, M, outBack, outCubic, Pill, ramp, Row, SceneProps, T, Waveform} from './ui';

const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ');
const cap = (s: string) => s.charAt(0).toLocaleUpperCase('ru-RU') + s.slice(1);

const Crown: React.FC<{size: number; c?: string}> = ({size, c = '#FFC83D'}) => (
	<svg viewBox="0 0 120 90" width={size} height={(size * 90) / 120}>
		<path d="M10 78 L4 20 L36 46 L60 6 L84 46 L116 20 L110 78 Z" fill={c} stroke="#E0A400" strokeWidth="4" strokeLinejoin="round" />
		<rect x="10" y="74" width="100" height="12" rx="4" fill="#E0A400" />
		{[20, 60, 100].map((x) => (
			<circle key={x} cx={x} cy={58} r="6" fill="#fff" opacity="0.9" />
		))}
	</svg>
);

// title card: the dynasty
const CrownScene: React.FC<SceneProps> = ({s, t}) => {
	const a = ramp(s, 0.1, 0.5, outBack);
	return (
		<Card y={40} h={560}>
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#FFF6D6 0%,#FFE1F0 55%,#DCE9FF 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', transform: `scale(${a}) rotate(${Math.sin(t * 2) * 4}deg)`}}>
				<Crown size={260} />
			</div>
			<Col gap={6} style={{position: 'absolute', left: 0, right: 0, top: 300, alignItems: 'center'}}>
				<T s={84} w={900} style={{letterSpacing: '-0.03em'}}>Династия</T>
				<M s={24}>трек · madk1d</M>
			</Col>
			<Row gap={20} style={{position: 'absolute', left: 50, right: 50, bottom: 50}}>
				<div style={{width: 76, height: 76, borderRadius: 38, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<T s={32} c="#fff">▶</T>
				</div>
				<Bar w={560} h={12} v={Math.min(1, s / 2)} c={C.ink} bg="rgba(0,0,0,0.1)" />
			</Row>
		</Card>
	);
};

// first million
const Million: React.FC<SceneProps> = ({p, s}) => {
	const bal = interpolate(p, [0, 0.8], [0, 1000000], {...clamp, easing: outCubic});
	const goal = Math.min(1, bal / 1000000);
	const done = goal > 0.999;
	return (
		<Card y={60} h={520}>
			<Abs x={44} y={40}>
				<Row gap={14}>
					<Icon bg={C.green} size={58}>₽</Icon>
					<T s={32} w={700}>Баланс</T>
				</Row>
			</Abs>
			<Abs x={44} y={130}>
				<T s={108} w={800} style={{fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em'}}>{fmt(bal)} ₽</T>
			</Abs>
			<Abs x={44} y={290}>
				<Col gap={12}>
					<Row style={{width: 690, justifyContent: 'space-between'}}>
						<M s={24}>цель</M>
						<M s={24} c={C.ink}>1 млн ₽</M>
					</Row>
					<Bar w={690} h={22} v={goal} c={C.green} />
				</Col>
			</Abs>
			<div style={{position: 'absolute', left: 44, top: 400, transform: `scale(${done ? ramp(p, 0.8, 0.9, outBack) : 0})`, transformOrigin: 'left center'}}>
				<Pill bg="#E3F8E9" c={C.green} s={32}>✓ Первый миллион · {Math.floor(s * 10) % 2 ? '🏆' : '🏆'}</Pill>
			</div>
		</Card>
	);
};

// podium, #1
const Champion: React.FC<SceneProps> = ({p, sinceWord, t}) => {
	const cols = [
		{h: 220, n: '2', c: '#C9CCD6', who: 'М'},
		{h: 320, n: '1', c: '#FFC83D', who: 'Я'},
		{h: 160, n: '3', c: '#E2A979', who: 'Д'},
	];
	const rise = ramp(p, 0, 0.45, outBack);
	return (
		<Card y={40} h={620}>
			<Abs x={44} y={36}>
				<Row gap={14}>
					<T s={40} w={800}>Топ недели</T>
					<Pill bg="#FFF4CC" c="#B07D00" s={22}>live</Pill>
				</Row>
			</Abs>
			<Row gap={24} style={{position: 'absolute', left: 0, right: 0, bottom: 50, justifyContent: 'center', alignItems: 'flex-end'}}>
				{cols.map((c, k) => {
					const first = k === 1;
					const h = c.h * rise;
					return (
						<Col key={k} gap={12} style={{alignItems: 'center'}}>
							<div style={{transform: first ? `translateY(${-Math.abs(Math.sin(t * 4)) * 10}px) scale(${1 + 0.1 * Math.exp(-sinceWord * 9)})` : undefined}}>
								{first && (
									<div style={{display: 'flex', justifyContent: 'center', marginBottom: -10}}>
										<Crown size={80} />
									</div>
								)}
								<Avatar size={first ? 110 : 84} letter={c.who} bg={first ? 'linear-gradient(160deg,#FF8A3D,#FF5FA2)' : 'linear-gradient(160deg,#8E9AB5,#5D6782)'} />
							</div>
							<div style={{width: 190, height: h, borderRadius: '24px 24px 0 0', background: c.c, display: 'flex', justifyContent: 'center', paddingTop: 16, boxSizing: 'border-box', overflow: 'hidden'}}>
								<T s={72} w={900} c="#fff">{c.n}</T>
							</div>
						</Col>
					);
				})}
			</Row>
		</Card>
	);
};

// face scan
const Face: React.FC<SceneProps> = ({p, t}) => {
	const scan = ((t * 0.9) % 1);
	const done = p > 0.7;
	const squeeze = 1 - 0.12 * Math.sin(Math.min(1, p / 0.7) * Math.PI);
	const blue = done ? C.green : C.blue;
	return (
		<Card y={40} h={620}>
			<div style={{position: 'absolute', left: 390 - 170, top: 60, width: 340, height: 340}}>
				{[
					[0, 0, 0],
					[1, 0, 90],
					[1, 1, 180],
					[0, 1, 270],
				].map(([x, y, r]) => (
					<div
						key={r}
						style={{
							position: 'absolute',
							left: x ? 340 - 80 : 0,
							top: y ? 340 - 80 : 0,
							width: 80,
							height: 80,
							borderLeft: `10px solid ${blue}`,
							borderTop: `10px solid ${blue}`,
							borderTopLeftRadius: 34,
							transform: `rotate(${r}deg)`,
						}}
					/>
				))}
				<svg viewBox="0 0 100 100" width={340} height={340} style={{position: 'absolute', inset: 0, transform: `scaleX(${squeeze})`}}>
					<circle cx="36" cy="40" r="3.5" fill={blue} />
					<circle cx="64" cy="40" r="3.5" fill={blue} />
					<path d="M50 40 V56 H45" stroke={blue} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
					<path d={done ? 'M34 66 Q50 78 66 66' : 'M36 68 Q50 72 64 68'} stroke={blue} strokeWidth="3.5" fill="none" strokeLinecap="round" />
				</svg>
				{!done && <div style={{position: 'absolute', left: 30, right: 30, top: 30 + scan * 280, height: 6, borderRadius: 3, background: C.blue, boxShadow: `0 0 24px ${C.blue}`, opacity: 0.8}} />}
			</div>
			<Col gap={6} style={{position: 'absolute', left: 0, right: 0, top: 440, alignItems: 'center'}}>
				<T s={40} w={800}>Скан лица</T>
				<M s={24} c={done ? C.green : C.sub}>{done ? 'готово ✓' : `сканирование… ${Math.floor(p * 140)}%`}</M>
			</Col>
		</Card>
	);
};

// creator profile
const Creator: React.FC<SceneProps> = ({s, p, opt, sinceWord}) => {
	const name = opt.name ?? 'creator';
	const stars = Math.min(5, Math.floor(ramp(s, 0.2, 1.2, (x) => x) * 5 + 0.0001));
	return (
		<Card y={40} h={600}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 180, background: 'linear-gradient(120deg,#FFB547,#FF5FA2 60%,#AF52DE)'}} />
			<div style={{position: 'absolute', left: 390 - 90, top: 90, border: '8px solid #fff', borderRadius: 100, transform: `scale(${1 + 0.06 * Math.exp(-sinceWord * 9)})`}}>
				<Avatar size={170} letter={cap(name).charAt(0)} bg="linear-gradient(160deg,#FF8A3D,#FF3B30)" />
			</div>
			<Col gap={6} style={{position: 'absolute', left: 0, right: 0, top: 290, alignItems: 'center'}}>
				<Row gap={10}>
					<T s={48} w={800}>{cap(name)}</T>
					<div style={{width: 40, height: 40, borderRadius: 20, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={24} c="#fff">✓</T>
					</div>
				</Row>
				<M s={24}>{opt.role ?? 'автор'} · знает толк</M>
				<Row gap={6} style={{marginTop: 8}}>
					{[0, 1, 2, 3, 4].map((k) => (
						<T key={k} s={48} c={k < stars ? '#FFC83D' : C.line}>★</T>
					))}
				</Row>
			</Col>
			<Row gap={18} style={{position: 'absolute', left: 0, right: 0, bottom: 40, justifyContent: 'center'}}>
				{['сообщение', 'вызов', 'видео'].map((l, k) => (
					<Col key={l} gap={6} style={{alignItems: 'center', width: 150, padding: '16px 0', borderRadius: 24, background: k === 2 && p > 0.5 ? '#E5F0FF' : C.fill}}>
						<T s={34} c={C.blue}>{['✉', '✆', '▶'][k]}</T>
						<M s={20} c={C.blue}>{l}</M>
					</Col>
				))}
			</Row>
		</Card>
	);
};

// phone camera
const Camera: React.FC<SceneProps> = ({s, t, frame}) => {
	const rec = s > 0.25;
	return (
		<Card y={30} h={640} r={60} style={{background: '#0E0E12'}}>
			<div style={{position: 'absolute', left: 20, right: 20, top: 20, height: 470, borderRadius: 40, overflow: 'hidden', background: 'linear-gradient(160deg,#2B1B47 0%,#7A1F5C 45%,#FF8A3D 100%)'}}>
				{Array.from({length: 14}).map((_, k) => (
					<div
						key={k}
						style={{
							position: 'absolute',
							left: rand(k) * 740 - 40,
							top: rand(k + 30) * 470 - 40,
							width: 60 + rand(k + 7) * 160,
							height: 60 + rand(k + 7) * 160,
							borderRadius: '50%',
							background: ['#FFD60A', '#FF5FA2', '#5AC8FA', '#fff'][k % 4],
							opacity: 0.18 + 0.2 * Math.abs(Math.sin(t * 2 + k)),
							filter: 'blur(18px)',
						}}
					/>
				))}
				{[1, 2].map((k) => (
					<div key={k} style={{position: 'absolute', left: (740 / 3) * k, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.25)'}} />
				))}
				{[1, 2].map((k) => (
					<div key={k} style={{position: 'absolute', top: (470 / 3) * k, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.25)'}} />
				))}
				<div style={{position: 'absolute', left: 370 - 60, top: 235 - 60, width: 120, height: 120, border: '4px solid #FFD60A', borderRadius: 12, transform: `scale(${1.2 - 0.2 * ramp(s, 0, 0.3)})`}} />
				<Abs x={0} y={24} style={{width: 740, display: 'flex', justifyContent: 'center'}}>
					<Pill bg={rec ? C.red : 'rgba(0,0,0,0.4)'} s={24}>
						{rec ? `● 00:0${Math.floor(s)}:${String(frame % 60).padStart(2, '0')}` : 'ВИДЕО · 4K · 60'}
					</Pill>
				</Abs>
				<Abs x={0} y={410} style={{width: 740, display: 'flex', justifyContent: 'center'}}>
					<Row gap={14}>
						{['.5', '1×', '3'].map((z, k) => (
							<div key={z} style={{width: 56, height: 56, borderRadius: 28, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<T s={k === 1 ? 24 : 20} w={800} c={k === 1 ? '#FFD60A' : '#fff'}>{z}</T>
							</div>
						))}
					</Row>
				</Abs>
			</div>
			<Row style={{position: 'absolute', left: 60, right: 60, bottom: 30, justifyContent: 'space-between'}}>
				<div style={{width: 70, height: 70, borderRadius: 14, background: 'linear-gradient(160deg,#7A1F5C,#FF8A3D)'}} />
				<div style={{width: 110, height: 110, borderRadius: 55, border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{width: rec ? 46 : 86, height: rec ? 46 : 86, borderRadius: rec ? 10 : 43, background: C.red}} />
				</div>
				<div style={{width: 70, height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<T s={34} c="#fff">⟲</T>
				</div>
			</Row>
		</Card>
	);
};

const QR: React.FC<{size: number; seed: number}> = ({size, seed}) => {
	const n = 21;
	const cell = size / n;
	const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
	return (
		<svg width={size} height={size}>
			<rect width={size} height={size} fill="#fff" />
			{Array.from({length: n * n}).map((_, i) => {
				const x = i % n;
				const y = Math.floor(i / n);
				if (finder(x, y)) return null;
				return rand(seed * 977 + i) > 0.52 ? <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill={C.ink} /> : null;
			})}
			{[
				[0, 0],
				[n - 7, 0],
				[0, n - 7],
			].map(([x, y]) => (
				<g key={`${x}-${y}`}>
					<rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} fill={C.ink} />
					<rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} fill="#fff" />
					<rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} fill={C.ink} />
				</g>
			))}
		</svg>
	);
};

// concert ticket
const Ticket: React.FC<SceneProps> = ({s, opt, sinceWord}) => {
	const city = opt.city ?? 'ГОРОД';
	const moscow = city.length > 4;
	const ok = ramp(s, 0.5, 0.7, outBack);
	return (
		<Card y={20} w={600} h={660}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 250, background: moscow ? 'linear-gradient(140deg,#0A84FF,#5AC8FA)' : 'linear-gradient(140deg,#FF2D7A,#AF52DE)'}}>
				<Abs x={30} y={26}>
					<Pill bg="rgba(255,255,255,0.25)" s={20}>КОНЦЕРТ</Pill>
				</Abs>
				<Abs x={430} y={26}>
					<Pill bg="rgba(255,255,255,0.25)" s={20}>● Live</Pill>
				</Abs>
				<div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', transform: `scale(${1 + 0.06 * Math.exp(-sinceWord * 9)})`}}>
					<T s={city.length > 4 ? 96 : 124} w={900} c="#fff" style={{letterSpacing: '-0.03em'}}>{city}</T>
				</div>
			</div>
			<Row style={{position: 'absolute', left: 36, right: 36, top: 280, justifyContent: 'space-between'}}>
				{[
					['дата', '17 окт'],
					['вход', '19:00'],
					['ряд', 'танцпол'],
				].map(([a, b]) => (
					<Col key={a} gap={2}>
						<M s={20}>{a}</M>
						<T s={30} w={800}>{b}</T>
					</Col>
				))}
			</Row>
			<div style={{position: 'absolute', left: 0, right: 0, top: 370, borderTop: `3px dashed ${C.line}`}} />
			<div style={{position: 'absolute', left: 300 - 115, top: 400, width: 230, height: 230}}>
				<QR size={230} seed={moscow ? 2 : 1} />
				<div style={{position: 'absolute', right: -22, bottom: -22, transform: `scale(${ok})`}}>
					<div style={{width: 64, height: 64, borderRadius: 32, background: C.green, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<T s={32} c="#fff">✓</T>
					</div>
				</div>
			</div>
		</Card>
	);
};

// voice memo on a named mic
const Record: React.FC<SceneProps> = ({s, rms, t, opt}) => (
	<Card y={40} h={600}>
		<Abs x={40} y={36}>
			<Row style={{width: 700, justifyContent: 'space-between'}}>
				<T s={40} w={800}>Новая запись</T>
				<T s={30} w={600} c={C.blue}>Готово</T>
			</Row>
		</Abs>
		<Abs x={40} y={110}>
			<Pill bg="#E8F1FF" c={C.blue} s={24}>🎙 Микрофон: {opt.mic ?? 'Samson'}</Pill>
		</Abs>
		<Abs x={40} y={190}>
			<div style={{position: 'relative'}}>
				<Waveform bars={46} w={700} h={170} rms={rms} />
				<div style={{position: 'absolute', right: 0, top: -10, width: 4, height: 190, background: C.red, borderRadius: 2}} />
			</div>
		</Abs>
		<Abs x={0} y={390} style={{width: 780, textAlign: 'center'}}>
			<T s={72} w={700} style={{fontVariantNumeric: 'tabular-nums'}}>
				0:0{Math.floor(s)},{Math.floor((s % 1) * 10)}
			</T>
		</Abs>
		<div style={{position: 'absolute', left: 390 - 50, top: 490, width: 100, height: 100, borderRadius: 50, border: `5px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{width: 40, height: 40, borderRadius: 10, background: C.red, transform: `scale(${0.9 + 0.1 * Math.sin(t * 6)})`}} />
		</div>
	</Card>
);

// chat with mom
const ChatMom: React.FC<SceneProps> = ({s, p, t}) => {
	const b1 = ramp(s, 0.05, 0.25, outBack);
	const typing = p > 0.3;
	return (
		<Card y={20} h={660} style={{background: '#E8F3DE'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'rgba(255,255,255,0.95)', borderBottom: `2px solid ${C.line}`}}>
				<Row gap={18} style={{padding: '22px 30px'}}>
					<T s={44} c={C.blue}>‹</T>
					<Avatar size={76} letter="М" bg="linear-gradient(160deg,#FF8FC7,#FF5FA2)" />
					<Col gap={2}>
						<T s={32} w={800}>Мама</T>
						<M s={22} c={typing ? C.blue : C.sub}>{typing ? 'печатает…' : 'в сети'}</M>
					</Col>
				</Row>
			</div>
			<Abs x={0} y={150} style={{width: 780}}>
				<Col gap={18} style={{alignItems: 'flex-end', padding: '0 30px'}}>
					<div style={{transform: `scale(${b1})`, transformOrigin: 'right bottom'}}>
						<Pill bg="#DCF8C6" c={C.ink} s={32} style={{borderRadius: 26}}>
							мам, послушай мой трек 🎧 <M s={18}>12:08 ✓✓</M>
						</Pill>
					</div>
				</Col>
			</Abs>
			{typing && (
				<Abs x={30} y={260}>
					<div style={{background: '#fff', borderRadius: 26, padding: '22px 28px', display: 'flex', gap: 12}}>
						{[0, 1, 2].map((k) => (
							<div key={k} style={{width: 18, height: 18, borderRadius: 9, background: '#9A9AA2', transform: `translateY(${-Math.max(0, Math.sin(t * 10 - k * 0.9)) * 10}px)`}} />
						))}
					</div>
				</Abs>
			)}
			<div style={{position: 'absolute', left: 24, right: 24, bottom: 24, height: 80, borderRadius: 40, background: '#fff'}}>
				<Row style={{height: 80, padding: '0 28px'}}>
					<T s={28} w={500} c={C.sub}>Сообщение</T>
				</Row>
			</div>
		</Card>
	);
};

const Mic: React.FC<{size: number}> = ({size}) => (
	<svg viewBox="0 0 60 140" width={(size * 60) / 140} height={size}>
		<rect x="22" y="58" width="16" height="80" rx="8" fill="#1C1C22" />
		<circle cx="30" cy="30" r="27" fill="#2C2C34" />
		<circle cx="30" cy="30" r="27" fill="url(#mesh)" />
		<defs>
			<pattern id="mesh" width="6" height="6" patternUnits="userSpaceOnUse">
				<circle cx="3" cy="3" r="1.4" fill="#6A6A76" />
			</pattern>
		</defs>
		<rect x="18" y="54" width="24" height="10" rx="3" fill="#8E8E98" />
	</svg>
);

// mom's reply + the mic goes to the trash
const TrashMic: React.FC<SceneProps> = ({p, wi, word}) => {
	const fly = ramp(p, 0.35, 0.8, (x) => x);
	const x0 = 200;
	const y0 = 250;
	const x1 = 560;
	const y1 = 330;
	const mx = x0 + (x1 - x0) * fly;
	const my = y0 + (y1 - y0) * fly - Math.sin(fly * Math.PI) * 220;
	const lid = interpolate(p, [0.3, 0.45, 0.8, 0.9], [0, -30, -30, 0], clamp);
	const gone = fly > 0.98;
	return (
		<Card y={20} h={660}>
			<Abs x={40} y={36}>
				<Row gap={18}>
					<Avatar size={70} letter="М" bg="linear-gradient(160deg,#FF8FC7,#FF5FA2)" />
					<div style={{background: C.fill, borderRadius: 26, padding: '16px 24px'}}>
						<T s={34} w={700}>{wi >= 0 ? cap(word) : ''}</T>
					</div>
				</Row>
			</Abs>
			{!gone && (
				<div style={{position: 'absolute', left: mx, top: my, transform: `rotate(${fly * 320 - 20}deg) scale(${1 - fly * 0.4})`, transformOrigin: 'center'}}>
					<Mic size={230} />
				</div>
			)}
			<div style={{position: 'absolute', left: x1 - 30, top: 350, width: 190, height: 260}}>
				<div style={{position: 'absolute', left: -8, top: 0, width: 206, height: 26, borderRadius: 8, background: C.ink, transform: `rotate(${lid}deg)`, transformOrigin: '6% 100%'}} />
				<div style={{position: 'absolute', left: 10, top: 34, width: 170, height: 220, borderRadius: '0 0 22px 22px', background: C.fill, border: `6px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
					{[0, 1, 2].map((k) => (
						<div key={k} style={{width: 8, height: 140, borderRadius: 4, background: C.ink, opacity: 0.55}} />
					))}
				</div>
			</div>
			<Abs x={40} y={590}>
				<M s={24} c={gone ? C.red : C.sub}>{gone ? '✕ микрофон удалён' : 'перетащите в корзину'}</M>
			</Abs>
		</Card>
	);
};

export const DYN_SCENES: Record<string, React.FC<SceneProps>> = {
	crown: CrownScene,
	million: Million,
	champion: Champion,
	face: Face,
	creator: Creator,
	camera: Camera,
	ticket: Ticket,
	record: Record,
	chatmom: ChatMom,
	trashmic: TrashMic,
};

export const DYN_CONFETTI: Record<string, number> = {million: 0.8, champion: 0.35};
