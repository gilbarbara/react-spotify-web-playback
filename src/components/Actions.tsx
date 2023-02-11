import { memo } from 'react';

import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, Locale, SpotifyDevice, StyledProps, StylesOptions } from '~/types';

import Devices from './Devices';
import Volume from './Volume';

interface Props {
  currentDeviceId: string;
  deviceId: string;
  devices: SpotifyDevice[];
  inlineVolume: boolean;
  isDevicesOpen: boolean;
  layout: Layout;
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
  },
  ({ style }: StyledProps) => {
    let styles: CssLikeObject = {
      bottom: px(28),
      paddingRight: px(4),
      position: 'absolute',
      right: 0,
      width: 'auto',
    };

    if (style.layout === 'responsive') {
      styles = {
        '@media (max-width: 767px)': styles,
        '@media (min-width: 768px)': {
          height: px(style.h),
        },
      };
    }

    return {
      height: px(32),
      ...styles,
    };
  },
  'ActionsRSWP',
);

function Actions(props: Props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    inlineVolume,
    isDevicesOpen,
    layout,
    locale,
    onClickDevice,
    playerPosition,
    setVolume,
    styles,
    volume,
  } = props;

  return (
    <Wrapper data-component-name="Actions" style={{ h: styles.height, layout }}>
      <Devices
        currentDeviceId={currentDeviceId}
        deviceId={deviceId}
        devices={devices}
        layout={layout}
        locale={locale}
        onClickDevice={onClickDevice}
        open={isDevicesOpen}
        playerPosition={playerPosition}
        styles={styles}
        title={locale.devices}
      />
      {currentDeviceId && (
        <Volume
          inlineVolume={inlineVolume}
          layout={layout}
          playerPosition={playerPosition}
          setVolume={setVolume}
          styles={styles}
          title={locale.volume}
          volume={volume}
        />
      )}
    </Wrapper>
  );
}

export default memo(Actions);
