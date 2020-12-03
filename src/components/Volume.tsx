import * as React from 'react';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';
import { px, styled } from '../styles';

import { StylesOptions, StyledProps } from '../types/common';

import ClickOutside from './ClickOutside';

import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMute from './icons/VolumeMute';

interface Props {
  playerPosition: string;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
  volume: number;
}

interface State {
  isOpen: boolean;
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

export default class Volume extends React.PureComponent<Props, State> {
  private timeout: number | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      volume: props.volume,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    const { volume: volumeState } = this.state;
    const { volume } = this.props;

    if (prevProps.volume !== volume && volume !== volumeState) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ volume });
    }
  }

  private handleClick = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  private handleChangeSlider = ({ y }: RangeSliderPosition) => {
    const { setVolume } = this.props;
    const volume = Math.round(y) / 100;

    clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => {
      setVolume(volume);
    }, 250);

    this.setState({ volume });
  };

  private handleAfterEnd = () => {
    setTimeout(() => {
      this.setState({ isOpen: false });
    }, 100);
  };

  public render() {
    const { isOpen, volume } = this.state;
    const {
      playerPosition,
      styles: { altColor, bgColor, color },
    } = this.props;
    let icon = <VolumeHigh />;

    if (volume === 0) {
      icon = <VolumeMute />;
    } else if (volume <= 0.5) {
      icon = <VolumeLow />;
    }

    return (
      <Wrapper style={{ altColor, bgColor, c: color, p: playerPosition }}>
        {isOpen && (
          <ClickOutside onClick={this.handleClick}>
            <RangeSlider
              axis="y"
              className="rrs"
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
              onAfterEnd={this.handleAfterEnd}
              onChange={this.handleChangeSlider}
              y={volume * 100}
              yMin={0}
              yMax={100}
            />
          </ClickOutside>
        )}
        <button type="button" onClick={!isOpen ? this.handleClick : undefined}>
          {icon}
        </button>
      </Wrapper>
    );
  }
}
