import React from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import { RangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';

import ClickOutside from './ClickOutside';

import VolumeHigh from './icons/VolumeHigh';
import VolumeLow from './icons/VolumeLow';
import VolumeMute from './icons/VolumeMute';

interface Props {
  volume: number;
  setVolume: (volume: number) => any;
}

interface State {
  isOpen: boolean;
}

export default class Volume extends React.Component<Props, State> {
  private timeout?: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  private handleClick = () => {
    const { isOpen } = this.state;

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({ isOpen: !isOpen });
    }, 100);
  };

  private handleChangeSlider = ({ y }: RangeSliderPosition) => {
    const { setVolume } = this.props;

    setVolume(Math.round(y) / 100);
  };

  private handleDragEndSlider = () => {
    this.setState({ isOpen: false });
  };

  public render() {
    const { isOpen } = this.state;
    const { volume } = this.props;
    let icon = <VolumeHigh />;

    if (volume === 0) {
      icon = <VolumeMute />;
    } else if (volume < 0.5) {
      icon = <VolumeLow />;
    }

    return (
      <div className="rswp__volume">
        {isOpen && (
          <ClickOutside onClick={this.handleClick}>
            <RangeSlider
              axis="y"
              styles={{
                options: {
                  handleBorderRadius: 12,
                  handleSize: 12,
                  padding: 0,
                  rangeColor: '#ccc',
                  trackColor: '#000',
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
      </div>
    );
  }
}
