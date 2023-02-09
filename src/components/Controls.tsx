import { memo } from 'react';

import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, Locale, StyledProps, StylesOptions } from '~/types';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';
import Slider from './Slider';

import { Spotify } from '../../global';

interface Props {
  durationMs: number;
  isExternalDevice: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  layout: Layout;
  locale: Locale;
  nextTracks: Spotify.Track[];
  onChangeRange: (position: number) => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  onToggleMagnify: () => void;
  position: number;
  previousTracks: Spotify.Track[];
  progressMs: number;
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {
    '.rswp__buttons': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: px(8),

      '> div': {
        alignItems: 'center',
        display: 'flex',
        minWidth: px(32),
        textAlign: 'center',
      },
    },

    button: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: px(16),
      height: px(32),
      justifyContent: 'center',
      width: px(32),

      '&.rswp__toggle': {
        fontSize: px(32),
        width: px(48),
      },
    },
  },
  ({ style }: StyledProps) => {
    const isCompactLayout = style.layout === 'compact';
    const styles: CssLikeObject = {};

    if (isCompactLayout) {
      styles.padding = px(8);
    } else {
      styles.padding = `${px(4)} 0`;
      styles['@media (max-width: 767px)'] = {
        padding: px(8),
      };
    }

    return {
      button: {
        color: style.c,
      },
      ...styles,
    };
  },
  'ControlsRSWP',
);

function Controls(props: Props) {
  const {
    durationMs,
    isExternalDevice,
    isMagnified,
    isPlaying,
    layout,
    locale,
    nextTracks,
    onChangeRange,
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    onToggleMagnify,
    position,
    previousTracks,
    progressMs,
    styles,
  } = props;

  const { color } = styles;

  return (
    <Wrapper data-component-name="Controls" data-playing={isPlaying} style={{ c: color, layout }}>
      <div className="rswp__buttons">
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
            <button
              aria-label={locale.next}
              onClick={onClickNext}
              title={locale.next}
              type="button"
            >
              <Next />
            </button>
          )}
        </div>
      </div>
      <Slider
        durationMs={durationMs}
        isMagnified={isMagnified}
        onChangeRange={onChangeRange}
        onToggleMagnify={onToggleMagnify}
        position={position}
        progressMs={progressMs}
        styles={styles}
      />
    </Wrapper>
  );
}

export default memo(Controls);
