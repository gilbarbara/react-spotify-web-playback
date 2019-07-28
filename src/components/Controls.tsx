import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps, IStylesOptions } from '../types/common';
import { IWebPlaybackTrack } from '../types/spotify';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

interface IProps {
  isExternalDevice: boolean;
  isPlaying: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  nextTracks: IWebPlaybackTrack[];
  previousTracks: IWebPlaybackTrack[];
  styles: IStylesOptions;
}

const Wrapper = styled('div')(
  {},
  ({ styles }: IStyledComponentProps) => ({
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

export default class Controls extends React.PureComponent<IProps> {
  public render() {
    const {
      isExternalDevice,
      isPlaying,
      onClickNext,
      onClickPrevious,
      onClickTogglePlay,
      nextTracks,
      previousTracks,
      styles,
    } = this.props;

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
}
