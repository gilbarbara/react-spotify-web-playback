import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';

interface Props {
  isMagnified: boolean;
  onChangeRange: (position: number) => void;
  onToggleMagnify: () => void;
  position: number;
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {
    display: 'flex',
    position: 'relative',
    transition: 'height 0.3s',
    zIndex: 10,
  },
  ({ style }: StyledProps) => ({
    height: px(style.sliderHeight),
  }),
  'SliderRSWP',
);

export default function Slider(props: Props) {
  const { isMagnified, onChangeRange, onToggleMagnify, position, styles } = props;

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
      style={{ sliderHeight: isMagnified ? styles.sliderHeight + 4 : styles.sliderHeight }}
    >
      <RangeSlider
        axis="x"
        className="slider"
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
    </Wrapper>
  );
}
