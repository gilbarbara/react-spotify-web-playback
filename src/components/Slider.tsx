import { memo } from 'react';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import { millisecondsToTime } from '~/modules/helpers';
import { px, styled } from '~/modules/styled';

import { StyledProps, StylesOptions } from '~/types';

interface Props {
  durationMs: number;
  isMagnified: boolean;
  onChangeRange: (position: number) => void;
  onToggleMagnify: () => void;
  position: number;
  progressMs: number;
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    fontSize: px(12),
    transition: 'height 0.3s',
    zIndex: 10,
  },
  ({ style }: StyledProps) => ({
    '[class^="rswp_"]': {
      color: style.c,
      lineHeight: 1,
      minWidth: px(32),
    },

    '.rswp_progress': {
      marginRight: px(style.sliderHeight + 6),
      textAlign: 'right',
    },

    '.rswp_duration': {
      marginLeft: px(style.sliderHeight + 6),
      textAlign: 'left',
    },
  }),
  'SliderRSWP',
);

function Slider(props: Props) {
  const { durationMs, isMagnified, onChangeRange, onToggleMagnify, position, progressMs, styles } =
    props;

  const handleChangeRange = async ({ x }: RangeSliderPosition) => {
    onChangeRange(x);
  };

  const handleSize = styles.sliderHeight + 6;

  return (
    <Wrapper
      data-component-name="Slider"
      data-position={position}
      onMouseEnter={onToggleMagnify}
      onMouseLeave={onToggleMagnify}
      style={{
        c: styles.color,
        sliderHeight: styles.sliderHeight,
      }}
    >
      <div className="rswp_progress">{millisecondsToTime(progressMs)}</div>
      <RangeSlider
        axis="x"
        className="slider"
        data-component-name="progress-bar"
        onChange={handleChangeRange}
        styles={{
          options: {
            thumbBorder: 0,
            thumbBorderRadius: styles.sliderHandleBorderRadius,
            thumbColor: styles.sliderHandleColor,
            thumbSize: isMagnified ? handleSize + 4 : handleSize,
            height: isMagnified ? styles.sliderHeight + 4 : styles.sliderHeight,
            padding: 0,
            rangeColor: styles.sliderColor,
            trackBorderRadius: styles.sliderTrackBorderRadius,
            trackColor: styles.sliderTrackColor,
          },
        }}
        x={position}
        xMax={100}
        xMin={0}
        xStep={0.1}
      />
      <div className="rswp_duration">{millisecondsToTime(durationMs)}</div>
    </Wrapper>
  );
}

export default memo(Slider);
