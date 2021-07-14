import * as React from 'react';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { WebPlaybackTrack } from '../types/spotify';

interface Props {
  isExternalDevice: boolean;
  isPlaying: boolean;
  nextTracks: WebPlaybackTrack[];
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  previousTracks: WebPlaybackTrack[];
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {},
  ({ style }: StyledProps) => ({
    alignItems: 'center',
    display: 'flex',
    height: px(style.h),
    justifyContent: 'center',

    '@media (max-width: 767px)': {
      padding: px(10),
    },

    '> div': {
      minWidth: px(style.h),
      textAlign: 'center',
    },

    button: {
      color: style.c,
      fontSize: px(16),

      '&.rswp__toggle': {
        fontSize: px(28),
      },
    },
  }),
  'ControlsRSWP',
);

export default function Controls(props: Props) {
  const {
    isExternalDevice,
    isPlaying,
    nextTracks,
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    previousTracks,
    styles: { color, height },
  } = props;

  return (
    <Wrapper style={{ c: color, h: height }}>
      <div>
        {(!!previousTracks.length || isExternalDevice) && (
          <button aria-label="Previous Track" onClick={onClickPrevious} type="button">
            <Previous />
          </button>
        )}
      </div>
      <div>
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="rswp__toggle"
          onClick={onClickTogglePlay}
          type="button"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
      </div>
      <div>
        {(!!nextTracks.length || isExternalDevice) && (
          <button aria-label="Next Track" onClick={onClickNext} type="button">
            <Next />
          </button>
        )}
      </div>
    </Wrapper>
  );
}
