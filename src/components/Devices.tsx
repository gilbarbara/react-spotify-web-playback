import React, { PureComponent } from 'react';
import { getDevices, setDevice } from '../spotify';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

import ClickOutside from './ClickOutside';

import DevicesIcon from './icons/Devices';

interface Props {
  deviceId?: string;
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  token: string;
  styles: StylesOptions;
}

export interface State {
  devices: SpotifyDevice[];
  isOpen: boolean;
}

const Wrapper = styled('div')(
  {
    position: 'relative',
    zIndex: 20,

    '> div': {
      backgroundColor: '#fff',
      bottom: '120%',
      boxShadow: '1px 1px 10px #ccc',
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
  ({ styles }: StyledComponentProps) => ({
    '> button': {
      color: styles.color,
    },
  }),
);

export default class Devices extends PureComponent<Props, State> {
  private timeout: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      devices: [],
      isOpen: props.open,
    };
  }

  public componentDidMount() {
    const { token } = this.props;

    getDevices(token).then(({ devices }) => {
      this.setState({ devices: devices || [] });
    });
  }

  private handleClickSetDevice = (e: React.MouseEvent<HTMLElement>) => {
    const { onClickDevice, token } = this.props;
    const { dataset } = e.currentTarget;

    if (dataset.id) {
      onClickDevice(dataset.id);
      setDevice(dataset.id, token);
      this.setState({ isOpen: false });
    }
  };

  private handleClickToggleDevices = () => {
    const { isOpen } = this.state;

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({ isOpen: !isOpen });
    }, 100);
  };

  public render() {
    const { devices, isOpen } = this.state;
    const { deviceId, styles } = this.props;

    return (
      <Wrapper styles={styles}>
        {!!devices.length && (
          <React.Fragment>
            {isOpen && (
              <ClickOutside onClick={this.handleClickToggleDevices}>
                {devices.map((d: SpotifyDevice) => (
                  <button
                    key={d.id}
                    className={d.id === deviceId ? 'rswp__devices__active' : undefined}
                    data-id={d.id}
                    onClick={this.handleClickSetDevice}
                    type="button"
                  >
                    {d.name}
                  </button>
                ))}
              </ClickOutside>
            )}
            <button type="button" onClick={this.handleClickToggleDevices}>
              <DevicesIcon />
            </button>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}
