import { memo } from 'react';

import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, Locale, SpotifyTrack, StyledProps, StylesOptions } from '~/types';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';
import Slider from './Slider';

interface Props {
  devices: JSX.Element | null;
  durationMs: number;
  isExternalDevice: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  layout: Layout;
  locale: Locale;
  nextTracks: SpotifyTrack[];
  onChangeRange: (position: number) => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  onToggleMagnify: () => void;
  position: number;
  previousTracks: SpotifyTrack[];
  progressMs: number;
  styles: StylesOptions;
  volume: JSX.Element | null;
}

const Wrapper = styled('div')(
  {
    '.rswp__volume': {
      position: 'absolute',
      right: 0,
      top: 0,
    },
    '.rswp__devices': {
      position: 'absolute',
      left: 0,
      top: 0,
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

    return styles;
  },
  'ControlsRSWP',
);

const Buttons = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: px(8),
    position: 'relative',

    '> div': {
      alignItems: 'center',
      display: 'flex',
      minWidth: px(32),
      textAlign: 'center',
    },
  },
  ({ style }: StyledProps) => ({
    color: style.c,
  }),
  'ControlsButtonsRSWP',
);

const Button = styled('button')(
  {
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
  () => ({}),
  'ControlsButtonRSWP',
);

function Controls(props: Props) {
  const {
    devices,
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
    volume,
  } = props;

  const { color } = styles;

  return (
    <Wrapper data-component-name="Controls" data-playing={isPlaying} style={{ layout }}>
      <Buttons style={{ c: color }}>
        {devices && <div className="rswp__devices">{devices}</div>}
        <div>
          {(!!previousTracks.length || isExternalDevice) && (
            <Button
              aria-label={locale.previous}
              onClick={onClickPrevious}
              title={locale.previous}
              type="button"
            >
              <Previous />
            </Button>
          )}
        </div>
        <div>
          <Button
            aria-label={isPlaying ? locale.pause : locale.play}
            className="rswp__toggle"
            onClick={onClickTogglePlay}
            title={isPlaying ? locale.pause : locale.play}
            type="button"
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </div>
        <div>
          {(!!nextTracks.length || isExternalDevice) && (
            <Button
              aria-label={locale.next}
              onClick={onClickNext}
              title={locale.next}
              type="button"
            >
              <Next />
            </Button>
          )}
        </div>
        {volume && <div className="rswp__volume">{volume}</div>}
      </Buttons>
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
