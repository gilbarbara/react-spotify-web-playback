import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps, IStylesOptions } from '../types/common';
import { ISpotifyDevice } from '../types/spotify';

import Devices from './Devices';
import Volume from './Volume';

interface IProps {
  currentDeviceId: string;
  devices: ISpotifyDevice[];
  isDevicesOpen: boolean;
  onClickDevice: (deviceId: string) => any;
  setVolume: (volume: number) => any;
  styles: IStylesOptions;
  volume: number;
}

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: px(10),

    '> div + div': {
      marginLeft: px(10),
    },

    '@media (max-width: 599px)': {
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 'auto',
    },
  },
  ({ styles }: IStyledComponentProps) => ({
    height: px(styles.height),
  }),
  'ActionsRSWP',
);

const Actions = ({
  currentDeviceId,
  devices,
  isDevicesOpen,
  onClickDevice,
  setVolume,
  styles,
  volume,
}: IProps) => {
  return (
    <Wrapper styles={styles}>
      {currentDeviceId && <Volume volume={volume} setVolume={setVolume} styles={styles} />}
      <Devices
        deviceId={currentDeviceId}
        devices={devices}
        open={isDevicesOpen}
        onClickDevice={onClickDevice}
        styles={styles}
      />
    </Wrapper>
  );
};

export default Actions;
