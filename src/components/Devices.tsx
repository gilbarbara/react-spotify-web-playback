import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps, IStylesOptions } from '../types/common';
import { ISpotifyDevice } from '../types/spotify';

import ClickOutside from './ClickOutside';

import DevicesIcon from './icons/Devices';

interface IProps {
  deviceId?: string;
  devices: ISpotifyDevice[];
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  styles: IStylesOptions;
}

export interface IState {
  isOpen: boolean;
}

const Wrapper = styled('div')(
  {
    position: 'relative',
    zIndex: 20,

    '> div': {
      bottom: '120%',
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
  ({ styles }: IStyledComponentProps) => ({
    '> button': {
      color: styles.color,
    },
    '> div': {
      backgroundColor: styles.bgColor,
      boxShadow: styles.altColor ? `1px 1px 10px ${styles.altColor}` : 'none',
      button: {
        color: styles.color,
      },
    },
  }),
  'DevicesRSWP',
);

export default class Devices extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isOpen: props.open,
    };
  }

  private handleClickSetDevice = (e: React.MouseEvent<HTMLElement>) => {
    const { onClickDevice } = this.props;
    const { dataset } = e.currentTarget;

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
    const { deviceId, devices, styles } = this.props;

    return (
      <Wrapper styles={styles}>
        {!!devices.length && (
          <React.Fragment>
            {isOpen && (
              <ClickOutside onClick={this.handleClickToggleDevices}>
                {devices.map((d: ISpotifyDevice) => (
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
