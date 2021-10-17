import * as React from 'react';

import Devices from './Devices';
import Volume from './Volume';

import { px, styled } from '../styles';
import { Locale, StyledProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

interface Props {
  currentDeviceId: string;
  deviceId: string;
  devices: SpotifyDevice[];
  isDevicesOpen: boolean;
  locale: Locale;
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
    locale,
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
          setVolume={setVolume}
          styles={styles}
          title={locale.volume}
          volume={volume}
        />
      )}
      <Devices
        currentDeviceId={currentDeviceId}
        deviceId={deviceId}
        devices={devices}
        onClickDevice={onClickDevice}
        open={isDevicesOpen}
        playerPosition={playerPosition}
        styles={styles}
        title={locale.devices}
      />
    </Wrapper>
  );
}

export default Actions;
