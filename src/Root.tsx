import React from 'react';
import {Composition} from 'remotion';
import {Video2} from './v2/Video2';
import {DATA} from './data';
import {H, W} from './theme';

export const Root: React.FC = () => (
	<Composition id="Perestan" component={Video2} durationInFrames={DATA.durationInFrames} fps={DATA.fps} width={W} height={H} />
);
