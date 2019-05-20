import React from 'react';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';

import Devices from './Devices';
import Volume from './Volume';

interface Props {
  currentDeviceId: string;
  isDevicesOpen: boolean;
  onClickDevice: (deviceId: string) => any;
  setVolume: (volume: number) => any;
  styles: StylesOptions;
  token: string;
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

const Actions = ({
  currentDeviceId,
  isDevicesOpen,
  onClickDevice,
  setVolume,
  styles,
  token,
  volume,
}: Props) => {
  return (
    <Wrapper styles={styles}>
      {currentDeviceId && <Volume volume={volume} setVolume={setVolume} styles={styles} />}
      <Devices
        deviceId={currentDeviceId}
        open={isDevicesOpen}
        onClickDevice={onClickDevice}
        styles={styles}
        token={token}
      />
    </Wrapper>
  );
};

export default Actions;
