import * as React from 'react';
import { px, styled } from '../styles';

import { StyledProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

import Devices from './Devices';
import Volume from './Volume';

interface Props {
  currentDeviceId: string;
  deviceId: string;
  devices: SpotifyDevice[];
  isDevicesOpen: boolean;
  onClickDevice: (deviceId: string) => any;
  playerPosition: string;
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
    'pointer-events': 'none',

    '> div + div': {
      marginLeft: px(10),
    },

    '@media (max-width: 1023px)': {
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 'auto',
    },
  },
  ({ style }: StyledProps) => ({
    height: px(style.h),
  }),
  'ActionsRSWP',
);

function Actions(props: Props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    isDevicesOpen,
    onClickDevice,
    playerPosition,
    setVolume,
    styles,
    volume,
  } = props;

  return (
    <Wrapper style={{ h: styles.height }}>
      {currentDeviceId && (
        <Volume
          playerPosition={playerPosition}
          volume={volume}
          setVolume={setVolume}
          styles={styles}
        />
      )}
      <Devices
        currentDeviceId={currentDeviceId}
        deviceId={deviceId}
        devices={devices}
        open={isDevicesOpen}
        onClickDevice={onClickDevice}
        playerPosition={playerPosition}
        styles={styles}
      />
    </Wrapper>
  );
}

export default Actions;
