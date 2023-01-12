import { MouseEvent, useState } from 'react';

import ClickOutside from './ClickOutside';
import DevicesIcon from './icons/Devices';

import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';

interface Props {
  currentDeviceId?: string;
  deviceId?: string;
  devices: SpotifyDevice[];
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  playerPosition: string;
  styles: StylesOptions;
  title: string;
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    position: 'relative',
    zIndex: 20,

    '> div': {
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
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },
    '> div': {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : 'none',
      [style.p]: '120%',
      button: {
        color: style.c,
      },
    },
  }),
  'DevicesRSWP',
);

export default function Devices(props: Props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    onClickDevice,
    open,
    playerPosition,
    styles: { activeColor, altColor, bgColor, color },
    title,
  } = props;
  const [isOpen, setOpen] = useState(open);

  const handleClickSetDevice = (event: MouseEvent<HTMLElement>) => {
    const { dataset } = event.currentTarget;

    /* istanbul ignore else */
    if (dataset.id) {
      onClickDevice(dataset.id);

      setOpen(false);
    }
  };

  const handleClickToggleDevices = () => {
    setOpen(s => !s);
  };

  return (
    <Wrapper
      data-component-name="Devices"
      data-device-id={currentDeviceId}
      style={{
        altColor,
        bgColor,
        c: currentDeviceId && deviceId && currentDeviceId !== deviceId ? activeColor : color,
        p: playerPosition,
      }}
    >
      {!!devices.length && (
        <>
          {isOpen && (
            <ClickOutside onClick={handleClickToggleDevices}>
              {devices.map((d: SpotifyDevice) => (
                <button
                  key={d.id}
                  aria-label={d.name}
                  className={d.id === currentDeviceId ? 'rswp__devices__active' : undefined}
                  data-id={d.id}
                  onClick={handleClickSetDevice}
                  type="button"
                >
                  {d.name}
                </button>
              ))}
            </ClickOutside>
          )}
          <button aria-label={title} onClick={handleClickToggleDevices} title={title} type="button">
            <DevicesIcon />
          </button>
        </>
      )}
    </Wrapper>
  );
}
