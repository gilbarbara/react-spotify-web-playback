import * as React from 'react';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

import Devices from './Devices';
import Volume from './Volume';

interface Props {
  currentDeviceId: string;
  devices: SpotifyDevice[];
  isDevicesOpen: boolean;
  onClickDevice: (deviceId: string) => any;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
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
  ({ styles }: StyledComponentProps) => ({
    height: px(styles.height),
  }),
  'ActionsRSWP',
);

function Actions(props: Props) {
  const {
    currentDeviceId,
    devices,
    isDevicesOpen,
    onClickDevice,
    setVolume,
    styles,
    volume,
  } = props;

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
}

export default Actions;
