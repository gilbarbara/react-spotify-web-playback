import React, { PureComponent } from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import { px, styled } from '../styles';

import { RangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';
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
    height: px(styles.rangeHeight),
  }),
);

export default class Slider extends PureComponent<Props> {
  private handleChangeRange = async ({ x }: RangeSliderPosition) => {
    const { onChangeRange } = this.props;

    onChangeRange(x);
  };

  public render() {
    const { isMagnified, onToggleMagnify, position, styles } = this.props;
    const nextStyles = {
      ...styles,
      rangeHeight: isMagnified ? styles.rangeHeight! + 4 : styles.rangeHeight,
    };
    const handleSize = styles.rangeHeight + 6;

    return (
      <Wrapper onMouseEnter={onToggleMagnify} onMouseLeave={onToggleMagnify} styles={nextStyles}>
        <RangeSlider
          axis="x"
          onChange={this.handleChangeRange}
          styles={{
            options: {
              handleBorder: 0,
              handleBorderRadius: styles.rangeHandleBorderRadius,
              handleColor: styles.rangeHandleColor,
              handleSize: isMagnified ? handleSize + 4 : handleSize,
              height: isMagnified ? styles.rangeHeight! + 4 : styles.rangeHeight,
              padding: 0,
              rangeColor: styles.rangeColor,
              trackBorderRadius: styles.rangeTrackBorderRadius,
              trackColor: styles.rangeTrackColor,
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
