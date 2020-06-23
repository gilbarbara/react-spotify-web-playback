import * as React from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import { IRangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';
import { px, styled } from '../styles';

import { StylesOptions, StyledComponentProps } from '../types/common';

import ClickOutside from './ClickOutside';

import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMute from './icons/VolumeMute';

interface Props {
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
    position: 'relative',
    zIndex: 20,

    '> div': {
      bottom: '120%',
      display: 'flex',
      flexDirection: 'column',
      padding: px(12),
      position: 'absolute',
      right: `-${px(3)}`,
    },

    '> button': {
      fontSize: px(26),
    },

    '@media (max-width: 879px)': {
      display: 'none',
    },
  },
  ({ styles }: StyledComponentProps) => ({
    '> button': {
      color: styles.color,
    },
    '> div': {
      backgroundColor: styles.bgColor,
      boxShadow: styles.altColor ? `1px 1px 10px ${styles.altColor}` : 'none',
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

  private handleChangeSlider = ({ y }: IRangeSliderPosition) => {
    const { setVolume } = this.props;
    const volume = Math.round(y) / 100;

    clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => {
      setVolume(volume);
    }, 250);

    this.setState({ volume });
  };

  private handleDragEndSlider = () => {
    this.setState({ isOpen: false });
  };

  public render() {
    const { isOpen, volume } = this.state;
    const { styles } = this.props;
    let icon = <VolumeHigh />;

    if (volume === 0) {
      icon = <VolumeMute />;
    } else if (volume <= 0.5) {
      icon = <VolumeLow />;
    }

    return (
      <Wrapper styles={styles}>
        {isOpen && (
          <ClickOutside onClick={this.handleClick}>
            <RangeSlider
              axis="y"
              classNamePrefix="rrs"
              styles={{
                options: {
                  handleBorder: `2px solid ${styles.color}`,
                  handleBorderRadius: 12,
                  handleColor: styles.bgColor,
                  handleSize: 12,
                  padding: 0,
                  rangeColor: styles.altColor || '#ccc',
                  trackColor: styles.color,
                  width: 6,
                },
              }}
              onClick={this.handleClick}
              onChange={this.handleChangeSlider}
              onDragEnd={this.handleDragEndSlider}
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
