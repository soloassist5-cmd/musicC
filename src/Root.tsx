import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {DATA} from './data';
import {H, W} from './theme';

export const Root: React.FC = () => (
	<Composition id="Perestan" component={Video} durationInFrames={DATA.durationInFrames} fps={DATA.fps} width={W} height={H} />
);
