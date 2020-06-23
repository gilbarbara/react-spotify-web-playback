import * as React from 'react';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';
import { WebPlaybackTrack } from '../types/spotify';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

interface Props {
  isExternalDevice: boolean;
  isPlaying: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  nextTracks: WebPlaybackTrack[];
  previousTracks: WebPlaybackTrack[];
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {},
  ({ styles }: StyledComponentProps) => ({
    alignItems: 'center',
    display: 'flex',
    height: px(styles.height),
    justifyContent: 'center',

    '@media (max-width: 767px)': {
      padding: px(10),
    },

    '> div': {
      minWidth: px(styles.height),
      textAlign: 'center',
    },

    button: {
      color: styles.color,
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
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    nextTracks,
    previousTracks,
    styles,
  } = props;

  return (
    <Wrapper styles={styles}>
      <div>
        {(!!previousTracks.length || isExternalDevice) && (
          <button type="button" onClick={onClickPrevious} aria-label="Previous Track">
            <Previous />
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          className="rswp__toggle"
          onClick={onClickTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
      </div>
      <div>
        {(!!nextTracks.length || isExternalDevice) && (
          <button type="button" onClick={onClickNext} aria-label="Next Track">
            <Next />
          </button>
        )}
      </div>
    </Wrapper>
  );
}
