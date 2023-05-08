import { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import { useMediaQuery, usePrevious } from '~/modules/hooks';
import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, Locale, StyledProps, StylesOptions } from '~/types';

import ClickOutside from './ClickOutside';
import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMid from './icons/VolumeMid';
import VolumeMute from './icons/VolumeMute';

interface Props {
  inlineVolume: boolean;
  layout: Layout;
  locale: Locale;
  playerPosition: string;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
  volume: number;
}

const WrapperWithToggle = styled('div')(
  {
    display: 'none',
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
      alignItems: 'center',
      backgroundColor: '#000',
      borderRadius: px(4),
      color: '#fff',
      display: 'flex',
      filter: 'drop-shadow(1px 1px 6px rgba(0, 0, 0, 0.5))',
      flexDirection: 'column',
      left: '-4px',
      padding: px(16),
      position: 'absolute',

      '> span': {
        background: 'transparent',
        borderLeft: `6px solid transparent`,
        borderRight: `6px solid transparent`,
        content: '""',
        display: 'block',
        height: 0,
        position: 'absolute',
        width: 0,
      },
    },

    '> button': {
      alignItems: 'center',
      display: 'flex',
      fontSize: px(24),
      height: px(32),
      justifyContent: 'center',
      width: px(32),
    },

    '@media (any-pointer: fine)': {
      display: 'block',
    },
  },
  ({ style }: StyledProps) => {
    const isCompact = style.layout === 'compact';
    const spanStyles: CssLikeObject = isCompact
      ? {
          bottom: `-${px(6)}`,
          borderTop: `6px solid #000`,
        }
      : {
          [style.p === 'top' ? 'border-bottom' : 'border-top']: `6px solid #000`,
          [style.p]: '-6px',
        };

    return {
      '> button': {
        color: style.c,
      },
      '> div': {
        [isCompact ? 'bottom' : style.p]: '130%',

        '> span': spanStyles,
      },
    };
  },
  'VolumeRSWP',
);

const WrapperInline = styled('div')(
  {
    display: 'none',
    padding: `0 ${px(8)}`,
    'pointer-events': 'all',

    '> div': {
      display: 'flex',
      padding: `0 ${px(5)}`,
      width: px(100),
    },

    '> span': {
      display: 'flex',
      fontSize: px(24),
    },

    '@media (any-pointer: fine)': {
      alignItems: 'center',
      display: 'flex',
    },
  },
  ({ style }) => ({
    color: style.c,
  }),
  'VolumeInlineRSWP',
);

export default function Volume(props: Props) {
  const { inlineVolume, layout, locale, playerPosition, setVolume, styles, volume } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [volumeState, setVolumeState] = useState(volume);
  const timeoutRef = useRef<number>();
  const previousVolume = usePrevious(volume);
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  const isInline = layout === 'responsive' && inlineVolume && isMediumScreen;

  useEffect(() => {
    if (previousVolume !== volume && volume !== volumeState) {
      setVolumeState(volume);
    }
  }, [previousVolume, volume, volumeState]);

  const handleClickToggleList = useCallback(() => {
    setIsOpen(s => !s);
  }, []);

  const handleChangeSlider = ({ x, y }: RangeSliderPosition) => {
    const value = isInline ? x : y;
    const currentvolume = Math.round(value) / 100;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setVolume(currentvolume);
    }, 250);

    setVolumeState(currentvolume);
  };

  const handleAfterEnd = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  let icon = <VolumeHigh />;

  if (volume === 0) {
    icon = <VolumeMute />;
  } else if (volume <= 0.4) {
    icon = <VolumeLow />;
  } else if (volume <= 0.7) {
    icon = <VolumeMid />;
  }

  if (isInline) {
    return (
      <WrapperInline data-component-name="Volume" data-value={volume} style={{ c: styles.color }}>
        <span>{icon}</span>
        <div>
          <RangeSlider
            axis="x"
            className="volume"
            data-component-name="volume-bar"
            onAfterEnd={handleAfterEnd}
            onChange={handleChangeSlider}
            styles={{
              options: {
                thumbBorder: 0,
                thumbBorderRadius: styles.sliderHandleBorderRadius,
                thumbColor: styles.sliderHandleColor,
                height: 4,
                padding: 0,
                rangeColor: styles.sliderColor,
                trackBorderRadius: styles.sliderTrackBorderRadius,
                trackColor: styles.sliderTrackColor,
              },
            }}
            x={volume * 100}
            xMax={100}
            xMin={0}
          />
        </div>
      </WrapperInline>
    );
  }

  return (
    <ClickOutside isActive={isOpen} onClick={handleClickToggleList}>
      <WrapperWithToggle
        data-component-name="Volume"
        data-value={volume}
        style={{ c: styles.color, layout, p: playerPosition }}
      >
        {isOpen && (
          <div>
            <RangeSlider
              axis="y"
              className="volume"
              data-component-name="volume-bar"
              onAfterEnd={handleAfterEnd}
              onChange={handleChangeSlider}
              styles={{
                options: {
                  padding: 0,
                  rangeColor: '#fff',
                  thumbBorder: 0,
                  thumbBorderRadius: 12,
                  thumbColor: '#fff',
                  thumbSize: 12,
                  trackColor: 'rgba(255, 255, 255, 0.5)',
                  width: 6,
                },
              }}
              y={volume * 100}
              yMax={100}
              yMin={0}
            />
            <span />
          </div>
        )}
        <button
          aria-label={locale.volume}
          className="ButtonRSWP"
          onClick={handleClickToggleList}
          title={locale.volume}
          type="button"
        >
          {icon}
        </button>
      </WrapperWithToggle>
    </ClickOutside>
  );
}
