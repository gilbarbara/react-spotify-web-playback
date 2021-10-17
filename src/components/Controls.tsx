import * as React from 'react';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

import { px, styled } from '../styles';
import { Locale, StyledProps, StylesOptions } from '../types/common';
import { WebPlaybackTrack } from '../types/spotify';

interface Props {
  isExternalDevice: boolean;
  isPlaying: boolean;
  locale: Locale;
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
      alignItems: 'center',
      color: style.c,
      display: 'inline-flex',
      fontSize: px(16),
      height: px(48),
      justifyContent: 'center',
      width: px(48),

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
    locale,
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
          <button
            aria-label={locale.previous}
            onClick={onClickPrevious}
            title={locale.previous}
            type="button"
          >
            <Previous />
          </button>
        )}
      </div>
      <div>
        <button
          aria-label={isPlaying ? locale.pause : locale.play}
          className="rswp__toggle"
          onClick={onClickTogglePlay}
          title={isPlaying ? locale.pause : locale.play}
          type="button"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
      </div>
      <div>
        {(!!nextTracks.length || isExternalDevice) && (
          <button aria-label={locale.next} onClick={onClickNext} title={locale.next} type="button">
            <Next />
          </button>
        )}
      </div>
    </Wrapper>
  );
}
