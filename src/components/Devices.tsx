import * as React from 'react';

import ClickOutside from './ClickOutside';
import DevicesIcon from './icons/Devices';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

interface Props {
  currentDeviceId?: string;
  deviceId?: string;
  devices: SpotifyDevice[];
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  playerPosition: string;
  styles: StylesOptions;
  title: string;
}

export interface State {
  isOpen: boolean;
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
      display: 'flex',
      flexDirection: 'column',
      padding: px(8),
      position: 'absolute',
      right: `-${px(3)}`,

      button: {
        display: 'block',
        padding: px(8),
        whiteSpace: 'nowrap',

        '&.rswp__devices__active': {
          fontWeight: 'bold',
        },
      },
    },

    '> button': {
      fontSize: px(26),
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
      button: {
        color: style.c,
      },
    },
  }),
  'DevicesRSWP',
);

export default class Devices extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: props.open,
    };
  }

  private handleClickSetDevice = (event: React.MouseEvent<HTMLElement>) => {
    const { onClickDevice } = this.props;
    const { dataset } = event.currentTarget;

    /* istanbul ignore else */
    if (dataset.id) {
      onClickDevice(dataset.id);

      this.setState({ isOpen: false });
    }
  };

  private handleClickToggleDevices = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  public render() {
    const { isOpen } = this.state;
    const {
      currentDeviceId,
      deviceId,
      devices,
      playerPosition,
      styles: { activeColor, altColor, bgColor, color },
      title,
    } = this.props;

    return (
      <Wrapper
        style={{
          altColor,
          bgColor,
          c: currentDeviceId && deviceId && currentDeviceId !== deviceId ? activeColor : color,
          p: playerPosition,
        }}
      >
        {!!devices.length && (
          <>
            {isOpen && (
              <ClickOutside onClick={this.handleClickToggleDevices}>
                {devices.map((d: SpotifyDevice) => (
                  <button
                    key={d.id}
                    className={d.id === currentDeviceId ? 'rswp__devices__active' : undefined}
                    data-id={d.id}
                    onClick={this.handleClickSetDevice}
                    type="button"
                  >
                    {d.name}
                  </button>
                ))}
              </ClickOutside>
            )}
            <button
              aria-label={title}
              onClick={this.handleClickToggleDevices}
              title={title}
              type="button"
            >
              <DevicesIcon />
            </button>
          </>
        )}
      </Wrapper>
    );
  }
}
