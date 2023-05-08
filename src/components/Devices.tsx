import { MouseEvent, useCallback, useState } from 'react';
import { CssLikeObject } from 'nano-css';

import { px, styled } from '~/modules/styled';

import { Layout, Locale, SpotifyDevice, StyledProps, StylesOptions } from '~/types';

import ClickOutside from './ClickOutside';
import DevicesIcon from './icons/Devices';
import DevicesComputerIcon from './icons/DevicesComputer';
import DevicesMobileIcon from './icons/DevicesMobile';
import DevicesSpeakerIcon from './icons/DevicesSpeaker';

interface Props {
  currentDeviceId?: string;
  deviceId?: string;
  devices: SpotifyDevice[];
  layout: Layout;
  locale: Locale;
  onClickDevice: (deviceId: string) => any;
  open: boolean;
  playerPosition: string;
  styles: StylesOptions;
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
      textAlign: 'left',

      '> p': {
        fontWeight: 'bold',
        marginBottom: px(8),
        marginTop: px(16),
        whiteSpace: 'nowrap',
      },

      button: {
        alignItems: 'center',
        display: 'flex',
        whiteSpace: 'nowrap',
        width: '100%',

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
  ({ style }: StyledProps) => {
    const isCompact = style.layout === 'compact';
    const divStyles: CssLikeObject = isCompact
      ? {
          bottom: '120%',
          left: 0,
        }
      : {
          [style.p]: '120%',
          left: 0,

          '@media (min-width: 768px)': {
            left: 'auto',
            right: 0,
          },
        };
    const spanStyles: CssLikeObject = isCompact
      ? {
          bottom: `-${px(6)}`,
          borderTop: `6px solid #000`,
          left: px(10),
        }
      : {
          [style.p === 'top' ? 'border-bottom' : 'border-top']: `6px solid #000`,
          [style.p]: '-6px',
          left: px(10),

          '@media (min-width: 768px)': {
            left: 'auto',
            right: px(10),
          },
        };

    return {
      '> button': {
        color: style.c,
      },

      '> div': {
        ...divStyles,

        '> span': spanStyles,
      },
    };
  },
  'DevicesRSWP',
);

const ListHeader = styled('div')({
  p: {
    whiteSpace: 'nowrap',

    '&:nth-of-type(1)': {
      fontWeight: 'bold',
      marginBottom: px(8),
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
    devices = [],
    layout,
    locale,
    onClickDevice,
    open,
    playerPosition,
    styles: { color },
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
          layout,
          p: playerPosition,
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
                        className="ButtonRSWP"
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
            <button
              aria-label={locale.devices}
              className="ButtonRSWP"
              onClick={handleClickToggleList}
              title={locale.devices}
              type="button"
            >
              {icon}
            </button>
          </>
        )}
      </Wrapper>
    </ClickOutside>
  );
}
