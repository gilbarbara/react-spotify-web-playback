import { memo } from 'react';

import { px, styled } from '~/modules/styled';

import { Locale, SpotifyDevice, StyledProps, StylesOptions } from '~/types';

import Devices from './Devices';
import Volume from './Volume';

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
    'pointer-events': 'none',

    '@media (max-width: 767px)': {
      bottom: px(28),
      paddingRight: px(4),
      position: 'absolute',
      right: 0,
      width: 'auto',
    },
  },
  ({ style }: StyledProps) => ({
    height: px(32),

    '@media (min-width: 768px)': {
      height: px(style.h),
    },
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
    <Wrapper data-component-name="Actions" style={{ h: styles.height }}>
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
        locale={locale}
        onClickDevice={onClickDevice}
        open={isDevicesOpen}
        playerPosition={playerPosition}
        styles={styles}
        title={locale.devices}
      />
    </Wrapper>
  );
}

export default memo(Actions);
