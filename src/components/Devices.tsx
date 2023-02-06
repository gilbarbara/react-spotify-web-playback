import { MouseEvent, useCallback, useState } from 'react';

import ClickOutside from './ClickOutside';
import DevicesIcon from './icons/Devices';
import DevicesComputerIcon from './icons/DevicesComputer';
import DevicesMobileIcon from './icons/DevicesMobile';
import DevicesSpeakerIcon from './icons/DevicesSpeaker';

import { px, styled } from '../modules/styled';
import { Locale, SpotifyDevice, StyledProps, StylesOptions } from '../types';

interface Props {
  currentDeviceId?: string;
  deviceId?: string;
  devices: SpotifyDevice[];
  locale: Locale;
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  playerPosition: string;
  styles: StylesOptions;
  title: string;
}

interface DeviceList {
  currentDevice: SpotifyDevice | null;
  otherDevices: SpotifyDevice[];
}

const Wrapper = styled('div')(
  {
    'pointer-events': 'all',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 20,

    '> div': {
      backgroundColor: '#000',
      borderRadius: px(8),
      color: '#fff',
      filter: 'drop-shadow(1px 1px 6px rgba(0, 0, 0, 0.5))',
      fontSize: px(14),
      padding: px(16),
      position: 'absolute',
      right: 0,

      '> p': {
        fontWeight: 'bold',
        marginBottom: px(16),
        marginTop: px(16),
        whiteSpace: 'nowrap',
      },

      button: {
        alignItems: 'center',
        display: 'flex',
        textAlign: 'left',
        whiteSpace: 'nowrap',

        '&:not(:last-of-type)': {
          marginBottom: px(12),
        },

        span: {
          display: 'inline-block',
          marginLeft: px(4),
        },
      },

      '> span': {
        background: 'transparent',
        borderLeft: `6px solid transparent`,
        borderRight: `6px solid transparent`,
        content: '""',
        display: 'block',
        height: 0,
        position: 'absolute',
        right: px(10),
        width: 0,
      },
    },

    '> button': {
      alignItems: 'center',
      display: 'flex',
      fontSize: px(24),
      height: px(32),
      justifyContent: 'center',
      width: px(32),
    },
  },
  ({ style }: StyledProps) => ({
    '> button': {
      color: style.c,
    },

    '> div': {
      [style.position]: '120%',

      '> span': {
        [style.position === 'top' ? 'border-bottom' : 'border-top']: `6px solid #000`,
        [style.position]: '-6px',
      },
    },
  }),
  'DevicesRSWP',
);

const ListHeader = styled('div')({
  p: {
    whiteSpace: 'nowrap',

    '&:nth-of-type(1)': {
      fontWeight: 'bold',
      marginBottom: px(4),
    },

    '&:nth-of-type(2)': {
      alignItems: 'center',
      display: 'flex',

      span: {
        display: 'inline-block',
        marginLeft: px(4),
      },
    },
  },
});

function getDeviceIcon(type: string) {
  if (type.toLowerCase().includes('speaker')) {
    return <DevicesSpeakerIcon />;
  }

  if (type.toLowerCase().includes('computer')) {
    return <DevicesComputerIcon />;
  }

  return <DevicesMobileIcon />;
}

export default function Devices(props: Props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    locale,
    onClickDevice,
    open,
    playerPosition,
    styles: { color },
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

  const handleClickToggleList = useCallback(() => {
    setOpen(s => !s);
  }, []);

  const { currentDevice, otherDevices } = devices.reduce<DeviceList>(
    (acc, device) => {
      if (device.id === currentDeviceId) {
        acc.currentDevice = device;
      } else {
        acc.otherDevices.push(device);
      }

      return acc;
    },
    { currentDevice: null, otherDevices: [] },
  );

  let icon = <DevicesIcon />;

  if (deviceId && currentDevice && currentDevice.id !== deviceId) {
    icon = getDeviceIcon(currentDevice.type);
  }

  return (
    <ClickOutside isActive={isOpen} onClick={handleClickToggleList}>
      <Wrapper
        data-component-name="Devices"
        data-device-id={currentDeviceId}
        style={{
          c: color,
          position: playerPosition,
        }}
      >
        {!!devices.length && (
          <>
            {isOpen && (
              <div>
                {currentDevice && (
                  <ListHeader>
                    <p>{locale.currentDevice}</p>
                    <p>
                      {getDeviceIcon(currentDevice.type)}
                      <span>{currentDevice.name}</span>
                    </p>
                  </ListHeader>
                )}
                {!!otherDevices.length && (
                  <>
                    <p>{locale.otherDevices}</p>
                    {otherDevices.map(device => (
                      <button
                        key={device.id}
                        aria-label={device.name}
                        data-id={device.id}
                        onClick={handleClickSetDevice}
                        type="button"
                      >
                        {getDeviceIcon(device.type)}
                        <span>{device.name}</span>
                      </button>
                    ))}
                  </>
                )}
                <span />
              </div>
            )}
            <button aria-label={title} onClick={handleClickToggleList} title={title} type="button">
              {icon}
            </button>
          </>
        )}
      </Wrapper>
    </ClickOutside>
  );
}
