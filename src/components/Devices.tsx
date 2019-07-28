import * as React from 'react';
import { getDevices, setDevice } from '../spotify';
import { px, styled } from '../styles';

import { IStyledComponentProps, IStylesOptions } from '../types/common';
import { ISpotifyDevice } from '../types/spotify';

import ClickOutside from './ClickOutside';

import DevicesIcon from './icons/Devices';

interface IProps {
  deviceId?: string;
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  token: string;
  styles: IStylesOptions;
}

export interface IState {
  devices: ISpotifyDevice[];
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
  // tslint:disable-next-line:variable-name
  private _isMounted = false;

  constructor(props: IProps) {
    super(props);

    this.state = {
      devices: [],
      isOpen: props.open,
    };
  }

  public async componentDidMount() {
    this._isMounted = true;
    const { token } = this.props;

    try {
      const { devices } = await getDevices(token);

      if (this._isMounted) {
        this.setState({ devices: devices || [] });
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('getDevices', error);
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
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
    this.setState(state => ({ isOpen: !state.isOpen }));
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
