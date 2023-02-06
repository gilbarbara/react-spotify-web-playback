import { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import ClickOutside from './ClickOutside';
import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMid from './icons/VolumeMid';
import VolumeMute from './icons/VolumeMute';

import { usePrevious } from '../modules/hooks';
import { px, styled } from '../modules/styled';
import { StyledProps, StylesOptions } from '../types';

interface Props {
  playerPosition: string;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
  title: string;
  volume: number;
}

const Wrapper = styled('div')(
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
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },
    '> div': {
      [style.position]: '130%',

      '> span': {
        [style.position === 'top' ? 'border-bottom' : 'border-top']: `6px solid #000`,
        [style.position]: '-6px',
      },
    },
  }),
  'VolumeRSWP',
);

export default function Volume(props: Props) {
  const {
    playerPosition,
    setVolume,
    styles: { color },
    title,
    volume,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [volumeState, setVolumeState] = useState(volume);
  const timeoutRef = useRef<number>();
  const previousVolume = usePrevious(volume);

  useEffect(() => {
    if (previousVolume !== volume && volume !== volumeState) {
      setVolumeState(volume);
    }
  }, [previousVolume, volume, volumeState]);

  const handleClickToggleList = useCallback(() => {
    setIsOpen(s => !s);
  }, []);

  const handleChangeSlider = ({ y }: RangeSliderPosition) => {
    const currentvolume = Math.round(y) / 100;

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

  return (
    <ClickOutside isActive={isOpen} onClick={handleClickToggleList}>
      <Wrapper
        data-component-name="Volume"
        data-value={volume}
        style={{ c: color, position: playerPosition }}
      >
        {isOpen && (
          <div>
            <RangeSlider
              axis="y"
              className="volume"
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
        <button aria-label={title} onClick={handleClickToggleList} title={title} type="button">
          {icon}
        </button>
      </Wrapper>
    </ClickOutside>
  );
}
