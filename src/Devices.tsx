import React from 'react';
import { getDevices, setDevice, SpotifyDevice } from './spotify';

import ClickOutside from './ClickOutside';

import DevicesIcon from './icons/Devices';

interface Props {
  deviceId?: string;
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  token: string;
}

export interface State {
  devices: SpotifyDevice[];
  isOpen: boolean;
}

export default class Devices extends React.Component<Props, State> {
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
    const { deviceId } = this.props;

    return (
      <div className="rswp__devices">
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
      </div>
    );
  }
}
