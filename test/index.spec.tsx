import React from 'react';
import { act, configure, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import * as helpers from '~/modules/helpers';

import SpotifyWebPlayer, { Props } from '~/index';

import { playerState, playerStatus } from './fixtures/data';
import { setBoundingClientRect } from './fixtures/helpers';

jest.spyOn(helpers, 'loadSpotifyPlayer').mockImplementation(() => Promise.resolve());

jest.useFakeTimers();

configure({ testIdAttribute: 'data-component-name' });

let playerStateResponse = playerState;
let playerStatusResponse = playerStatus;

const mockAddListener = jest.fn();

const initializePlayer = async () => {
  const [, readyFn] = mockAddListener.mock.calls.find(d => d[0] === 'ready');

  await readyFn({ device_id: deviceId });
};

const updatePlayer = async (state?: Partial<Spotify.PlaybackState>) => {
  const [, stateChangeFn] = mockAddListener.mock.calls.find(d => d[0] === 'player_state_changed');

  await stateChangeFn({ ...playerState, ...state });
};

const mockFn = jest.fn();
const mockActivateElement = jest.fn();
const mockCallback = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockGetCurrentState = jest.fn(() => playerStateResponse);
const mockGetOAuthToken = jest.fn();
const mockGetVolume = jest.fn(() => 1);
const mockNextTrack = jest.fn(updatePlayer);
const mockPreviousTrack = jest.fn(updatePlayer);
const mockRemoveListener = jest.fn();
const mockSetName = jest.fn();
const mockSetVolume = jest.fn();
const mockTogglePlay = jest.fn(updatePlayer);

const deviceId = '19ks98hfbxc53vh34jd';
const externalDeviceId = 'df17372ghs982js892js';
const token =
  'BQDoGCFtLXDAVgphhrRSPFHmhG9ZND3BLzSE5WVE-2qoe7_YZzRcVtZ6F7qEhzTih45GyxZLhp9b53A1YAPObAgV0MDvsbcQg-gZzlrIeQwwsWnz3uulVvPMhqssNP5HnE5SX0P0wTOOta1vneq2dL4Hvdko5WqvRivrEKWXCvJTPAFStfa5V5iLdCSglg';
const trackUris = ['spotify:track:2ViHeieFA3iPmsBya2NDFl', 'spotify:track:5zq709Rk69kjzCDdNthSbK'];

const baseProps = {
  callback: mockCallback,
  token,
  uris: 'spotify:album:7KvKuWUxxNPEU80c4i5AQk',
};

interface SetupProps extends Partial<Props> {
  initialize?: boolean;
  skipUpdate?: boolean;
  updateState?: Partial<Spotify.PlaybackState>;
}

async function setup(props?: SetupProps) {
  const { initialize = true, skipUpdate = false, updateState, ...rest } = props || {};
  const view = render(<SpotifyWebPlayer {...baseProps} {...rest} />);

  await act(async () => {
    window.onSpotifyWebPlaybackSDKReady();
  });

  if (initialize) {
    await act(async () => {
      await initializePlayer();

      if (!skipUpdate) {
        await updatePlayer(updateState);
      }
    });
  }

  return view;
}

function setExternalDevice() {
  // open the device selector
  fireEvent.click(screen.getByLabelText('Devices'));

  // select the external device
  fireEvent.click(screen.getByLabelText('Jest Player'));
}

class Player {
  _options: any;

  constructor(options: Record<string, any>) {
    options.getOAuthToken(mockGetOAuthToken);

    // eslint-disable-next-line no-underscore-dangle
    this._options = options;
  }

  activateElement = mockActivateElement;
  addListener = mockAddListener;
  connect = mockConnect;
  disconnect = mockDisconnect;
  getCurrentState = mockGetCurrentState;
  getVolume = mockGetVolume;
  nextTrack = mockNextTrack;
  on = mockFn;
  pause = mockFn;
  previousTrack = mockPreviousTrack;
  removeListener = mockRemoveListener;
  resume = mockFn;
  seek = mockFn;
  setName = mockSetName;
  setVolume = mockSetVolume;
  togglePlay = mockTogglePlay;
}

describe('SpotifyWebPlayer', () => {
  beforeAll(async () => {
    window.Spotify = {
      // @ts-ignore
      Player,
    };

    fetchMock.mockIf(/.*/, request => {
      const { method, url } = request;

      if (url.match(/contains\?ids=*/)) {
        return Promise.resolve({
          body: JSON.stringify([false]),
        });
      } else if (url === 'https://api.spotify.com/v1/me/player/devices') {
        return Promise.resolve({
          body: JSON.stringify({
            devices: [
              {
                id: externalDeviceId,
                name: 'Jest Player',
                type: 'Computer',
              },
            ],
          }),
        });
      } else if (url === 'https://api.spotify.com/v1/me/player') {
        return Promise.resolve({
          body: JSON.stringify(playerStatusResponse),
        });
      } else if (method === 'GET' && url === 'https://api.spotify.com/v1/me/tracks') {
        return Promise.resolve({ status: 200 });
      } else if (method === 'PUT' && url === 'https://api.spotify.com/v1/me/tracks') {
        return Promise.resolve({ status: 200 });
      } else if (['POST', 'PUT'].includes(request.method)) {
        return Promise.resolve({ status: 204 });
      }

      return Promise.resolve({ status: 404 });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Error listeners', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('should handle `authentication_error`', async () => {
      const { rerender, unmount } = await setup({ initialize: false });

      const [authenticationType, authenticationFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'authentication_error',
      );

      await act(async () => {
        authenticationFn({ type: authenticationType, message: 'Failed to authenticate' });
      });

      expect(screen.getByTestId('Player')).toHaveAttribute('data-ready', 'false');
      expect(screen.getByTestId('Player')).toMatchSnapshot('With Error');
      expect(mockDisconnect).toHaveBeenCalledTimes(1);

      rerender(<SpotifyWebPlayer {...baseProps} token={`${token}BB`} />);

      await act(async () => {
        await initializePlayer();
      });

      expect(screen.getByTestId('Player')).toHaveAttribute('data-ready', 'true');

      unmount();
    });

    it('should handle `account_error`', async () => {
      await setup({ initialize: false });

      const [accountType, accountFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'account_error',
      );

      await act(async () => {
        accountFn({ type: accountType, message: 'Failed to validate Spotify account' });
      });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle `initialization_error`', async () => {
      await setup({ initialize: false });

      const [initializationType, initializationFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'initialization_error',
      );

      await act(async () => {
        initializationFn({ type: initializationType, message: 'Failed to initialize' });
      });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle `playback_error`', async () => {
      const { unmount } = await setup({ initialize: true });

      const [playbackType, playbackFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'playback_error',
      );

      await act(async () => {
        playbackFn({ type: playbackType, message: 'Failed to perform playback' });
      });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
      expect(mockDisconnect).not.toHaveBeenCalled();

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Device listeners', () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('should handle `ready`', async () => {
      await setup({ skipUpdate: true });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
    });

    it('should handle `player_state_changed`', async () => {
      await setup({
        updateState: {
          paused: false,
        },
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
    });
  });

  describe('With the local player', () => {
    const props = { autoPlay: true, showSaveIcon: true };

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize the token', async () => {
      await setup(props);

      expect(mockGetOAuthToken).toHaveBeenCalledWith(token);
    });

    it('should render a loader while initializing', async () => {
      await setup({ initialize: false });

      expect(screen.getByTestId('Loader')).toBeInTheDocument();
    });

    it('should render the full UI', async () => {
      await setup(props);

      expect(screen.getByTestId('Player')).toMatchSnapshot();
    });

    it('should handle range changes', async () => {
      setBoundingClientRect('slider');
      await setup(props);
      const range = screen.getByTestId('Slider');

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(range.querySelector('.slider__track')!, {
        clientX: 410,
        clientY: 718,
        currentTarget: {},
      });

      await waitFor(() => {
        expect(screen.getByTestId('Slider')).toHaveAttribute('data-position', '40');
      });
    });

    it('should handle range magnification', async () => {
      await setup({ ...props, magnifySliderOnHover: true });
      const progressBar = screen.getByTestId('progress-bar');

      expect(screen.getAllByLabelText('slider handle')[0]).toHaveStyle({
        height: '10px',
      });

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.mouseEnter(progressBar.querySelector('.slider__track')!);

      expect(within(progressBar).getByLabelText('slider handle')).toHaveStyle({
        height: '14px',
      });

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.mouseLeave(progressBar.querySelector('.slider__track')!);

      expect(within(progressBar).getByLabelText('slider handle')).toHaveStyle({
        height: '10px',
      });
    });

    it('should handle Volume changes', async () => {
      setBoundingClientRect('volume');

      await setup({ ...props, inlineVolume: false });

      expect(screen.getByTestId('VolumeHigh')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Volume'));

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(screen.getByTestId('Volume').querySelector('.volume__track')!, {
        clientX: 910,
        clientY: 25,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0.5);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0.5');
      expect(screen.getByTestId('VolumeMid')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Volume'));

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(screen.getByTestId('Volume').querySelector('.volume__track')!, {
        clientX: 910,
        clientY: 35,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0.3);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0.3');
      expect(screen.getByTestId('VolumeLow')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Volume'));

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(screen.getByTestId('Volume').querySelector('.volume__track')!, {
        clientX: 910,
        clientY: 50,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0');
      expect(screen.getByTestId('VolumeMute')).toBeInTheDocument();
    });

    it('should handle Volume changes with "inlineVolume"', async () => {
      setBoundingClientRect('volumeInline');

      await setup(props);

      expect(screen.getByTestId('VolumeHigh')).toBeInTheDocument();

      // eslint-disable-next-line testing-library/no-node-access
      const getTrack = () => screen.getByTestId('Volume').querySelector('.volume__track')!;

      fireEvent.click(getTrack(), {
        clientX: 950,
        clientY: 52,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0.5);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0.5');
      expect(screen.getByTestId('VolumeMid')).toBeInTheDocument();

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(getTrack(), {
        clientX: 930,
        clientY: 52,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0.3);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0.3');
      expect(screen.getByTestId('VolumeLow')).toBeInTheDocument();

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(getTrack(), {
        clientX: 900,
        clientY: 52,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(mockSetVolume).toHaveBeenCalledWith(0);
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0');
      expect(screen.getByTestId('VolumeMute')).toBeInTheDocument();
    });

    it('should handle URIs changes', async () => {
      const { rerender } = await setup(props);

      rerender(<SpotifyWebPlayer {...baseProps} offset={1} uris={trackUris} />);

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player/play?device_id=19ks98hfbxc53vh34jd',
        expect.any(Object),
      );
      expect(mockTogglePlay).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'false');
      });
    });

    it('should handle Control clicks', async () => {
      await setup(props);

      // Click the previous track
      fireEvent.click(screen.getByLabelText('Previous'));
      expect(mockPreviousTrack).toHaveBeenCalled();

      // Play the next track
      fireEvent.click(screen.getByLabelText('Next'));
      expect(mockNextTrack).toHaveBeenCalled();

      fireEvent.click(screen.getByLabelText('Pause'));

      await waitFor(() => {
        expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'false');
      });
    });

    it('should handle Info clicks', async () => {
      await setup(props);

      fireEvent.click(screen.getByLabelText('Save to your favorites'));

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/tracks',
        expect.objectContaining({ method: 'PUT' }),
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Remove from your favorites')).toBeInTheDocument();
      });
    });
  });

  describe('With an external device', () => {
    const props: SetupProps = { autoPlay: true, showSaveIcon: true };

    it('should handle Device selection', async () => {
      await setup(props);

      setExternalDevice();

      expect(screen.getByTestId('Devices')).toHaveAttribute('data-device-id', externalDeviceId);

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player',
        expect.objectContaining({ method: 'GET' }),
      );

      await waitFor(() => {
        expect(screen.getByTestId('Slider')).toHaveAttribute('data-position', '0.1');
      });
    });

    it('should handle Volume changes', async () => {
      setBoundingClientRect('volumeInline');
      playerStatusResponse = {
        ...playerStatus,
        device: {
          ...playerStatus.device,
          volume_percent: 60,
        },
      };
      await setup(props);

      setExternalDevice();

      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(screen.getByTestId('Volume').querySelector('.volume__track')!, {
        clientX: 950,
        clientY: 50,
        currentTarget: {},
      });

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/player/volume?volume_percent=50',
        expect.objectContaining({ method: 'PUT' }),
      );
      expect(screen.getByTestId('Volume')).toHaveAttribute('data-value', '0.5');
    });

    it('should handle Control clicks', async () => {
      // reset the response (playing)
      playerStatusResponse = {
        ...playerStatus,
        is_playing: true,
      };

      await setup({ ...props, autoPlay: false });

      setExternalDevice();

      fireEvent.click(screen.getByLabelText('Play'));

      expect(fetchMock).toHaveBeenLastCalledWith(
        `https://api.spotify.com/v1/me/player/play?device_id=${externalDeviceId}`,
        expect.any(Object),
      );

      await waitFor(() => {
        expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'true');
      });

      // Play the previous track
      fireEvent.click(screen.getByLabelText('Previous'));

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player/previous',
        expect.any(Object),
      );

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player',
        expect.any(Object),
      );

      // Play the next track
      fireEvent.click(screen.getByLabelText('Next'));

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player/next',
        expect.any(Object),
      );

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player',
        expect.any(Object),
      );

      // Pause the player
      fireEvent.click(screen.getByLabelText('Pause'));

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player/pause',
        expect.any(Object),
      );

      // reset the response again (paused)
      playerStatusResponse = playerStatus;

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://api.spotify.com/v1/me/player',
        expect.any(Object),
      );

      expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'false');
    });
  });

  describe('With "persistDeviceSelection"', () => {
    it('should handle "persistDeviceSelection"', async () => {
      await setup({ persistDeviceSelection: true });

      expect(sessionStorage.getItem('rswpDeviceId')).toBe(deviceId);

      setExternalDevice();

      await waitFor(() => {
        expect(sessionStorage.getItem('rswpDeviceId')).toBe(externalDeviceId);
      });
    });
  });

  describe('With "syncExternalDevice"', () => {
    it('should handle syncExternalDevice changes', async () => {
      playerStatusResponse = {
        ...playerStatus,
        is_playing: true,
      };

      await setup({ syncExternalDevice: true, uris: undefined });

      expect(screen.getByTestId('Devices')).toHaveAttribute(
        'data-device-id',
        playerStatus.device.id,
      );
    });
  });

  describe('With control props', () => {
    it('should honor the "play" prop', async () => {
      playerStatusResponse = {
        ...playerStatus,
        is_playing: true,
      };

      const { rerender } = await setup({ play: true });

      expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'true');

      playerStateResponse = {
        ...playerState,
        paused: true,
      };

      rerender(<SpotifyWebPlayer {...baseProps} play={false} />);

      await act(async () => {
        jest.runOnlyPendingTimers();
      });

      expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'false');
    });

    it('should handle "offset" updates', async () => {
      const props = {
        autoPlay: true,
        uris: trackUris,
      };

      const { rerender } = await setup(props);

      expect(screen.getByTestId('Controls')).toHaveAttribute('data-playing', 'true');
      expect(fetchMock).toHaveBeenLastCalledWith(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        expect.objectContaining({
          body: JSON.stringify({
            uris: trackUris,
            offset: { position: 0 },
          }),
        }),
      );

      rerender(<SpotifyWebPlayer {...baseProps} {...props} offset={1} />);

      expect(fetchMock).toHaveBeenLastCalledWith(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        expect.objectContaining({
          body: JSON.stringify({
            uris: trackUris,
            offset: { position: 1 },
          }),
        }),
      );
    });
  });

  describe('With "compact" layout', () => {
    it('should render properly', async () => {
      await setup({ layout: 'compact', styles: { bgColor: '#f04', color: '#fff' } });

      expect(screen.getByTestId('Player')).toMatchSnapshot();
    });
  });

  describe('With "getPlayer" prop', () => {
    it('should return the player', async () => {
      const mockGetPlayer = jest.fn();

      await setup({ getPlayer: mockGetPlayer });

      expect(mockGetPlayer).toHaveBeenCalledTimes(1);
    });
  });

  describe('With "components" prop', () => {
    it('should render the components', async () => {
      await setup({
        components: {
          leftButton: <button type="button">Left</button>,
          rightButton: <button type="button">Right</button>,
        },
      });

      expect(screen.getByTestId('Controls')).toMatchSnapshot();
    });
  });
});
