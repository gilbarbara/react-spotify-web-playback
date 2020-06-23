import * as React from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import { IRangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';

interface Props {
  isMagnified: boolean;
  onToggleMagnify: () => void;
  onChangeRange: (position: number) => void;
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
  ({ styles }: StyledComponentProps) => ({
    height: px(styles.sliderHeight),
  }),
  'SliderRSWP',
);

export default class Slider extends React.PureComponent<Props> {
  private handleChangeRange = async ({ x }: IRangeSliderPosition) => {
    const { onChangeRange } = this.props;

    onChangeRange(x);
  };

  public render() {
    const { isMagnified, onToggleMagnify, position, styles } = this.props;
    const nextStyles = {
      ...styles,
      sliderHeight: isMagnified ? styles.sliderHeight! + 4 : styles.sliderHeight,
    };
    const handleSize = styles.sliderHeight + 6;

    return (
      <Wrapper onMouseEnter={onToggleMagnify} onMouseLeave={onToggleMagnify} styles={nextStyles}>
        <RangeSlider
          axis="x"
          onChange={this.handleChangeRange}
          styles={{
            options: {
              handleBorder: 0,
              handleBorderRadius: styles.sliderHandleBorderRadius,
              handleColor: styles.sliderHandleColor,
              handleSize: isMagnified ? handleSize + 4 : handleSize,
              height: isMagnified ? styles.sliderHeight! + 4 : styles.sliderHeight,
              padding: 0,
              rangeColor: styles.sliderColor,
              trackBorderRadius: styles.sliderTrackBorderRadius,
              trackColor: styles.sliderTrackColor,
            },
          }}
          x={position}
          xMin={0}
          xMax={100}
          xStep={0.1}
        />
      </Wrapper>
    );
  }
}
