import { useEffect, useRef, useState } from 'react';
import { usePrevious } from 'react-use';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import ClickOutside from './ClickOutside';
import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMute from './icons/VolumeMute';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';

interface Props {
  playerPosition: string;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
  title: string;
  volume: number;
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
      display: 'flex',
      flexDirection: 'column',
      padding: px(12),
      position: 'absolute',
      right: `-${px(3)}`,
    },

    '> button': {
      fontSize: px(26),
    },

    '@media (max-width: 1023px)': {
      display: 'none',
    },
  },
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },
    '> div': {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : 'none',
      [style.p]: '120%',
    },
  }),
  'VolumeRSWP',
);

export default function Volume(props: Props) {
  const {
    playerPosition,
    setVolume,
    styles: { altColor, bgColor, color },
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

  const handleClick = () => {
    setIsOpen(s => !s);
  };

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
  } else if (volume <= 0.5) {
    icon = <VolumeLow />;
  }

  return (
    <Wrapper
      data-component-name="Volume"
      data-value={volume}
      style={{ altColor, bgColor, c: color, p: playerPosition }}
    >
      {isOpen && (
        <ClickOutside onClick={handleClick}>
          <RangeSlider
            axis="y"
            className="volume"
            onAfterEnd={handleAfterEnd}
            onChange={handleChangeSlider}
            styles={{
              options: {
                thumbBorder: `2px solid ${color}`,
                thumbBorderRadius: 12,
                thumbColor: bgColor,
                thumbSize: 12,
                padding: 0,
                rangeColor: altColor || '#ccc',
                trackColor: color,
                width: 6,
              },
            }}
            y={volume * 100}
            yMax={100}
            yMin={0}
          />
        </ClickOutside>
      )}
      <button
        aria-label={title}
        onClick={!isOpen ? handleClick : undefined}
        title={title}
        type="button"
      >
        {icon}
      </button>
    </Wrapper>
  );
}
