import React from 'react';

import fetchMock from 'fetch-mock';
import SpotifyWebPlayer, { STATUS } from '../src'; // eslint-disable-line import/no-unresolved

import { playerState, playerStatus } from './fixtures/data';

fetchMock.config.overwriteRoutes = false;
jest.useFakeTimers();

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

let playerStateResponse = playerState;
let playerStatusResponse = playerStatus;

const mockAddListener = jest.fn();

const updatePlayer = async () => {
  const [, stateChangeFn] = mockAddListener.mock.calls.find(d => d[0] === 'player_state_changed');

  await stateChangeFn(playerStateResponse);
};

const mockCallback = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockGetCurrentState = jest.fn(() => playerStateResponse);
const mockGetOAuthToken = jest.fn();
const mockGetVolume = jest.fn(() => 1);
const mockNextTrack = jest.fn(updatePlayer);
const mockPreviousTrack = jest.fn(updatePlayer);
const mockSetVolume = jest.fn();
const mockTogglePlay = jest.fn(updatePlayer);

const deviceId = '19ks98hfbxc53vh34jd';
const token =
  'BQDoGCFtLXDAVgphhrRSPFHmhG9ZND3BLzSE5WVE-2qoe7_YZzRcVtZ6F7qEhzTih45GyxZLhp9b53A1YAPObAgV0MDvsbcQg-gZzlrIeQwwsWnz3uulVvPMhqssNP5HnE5SX0P0wTOOta1vneq2dL4Hvdko5WqvRivrEKWXCvJTPAFStfa5V5iLdCSglg';

const setup = props => {
  mockAddListener.mockClear();
  mockCallback.mockClear();
  mockConnect.mockClear();
  mockDisconnect.mockClear();
  mockGetCurrentState.mockClear();
  mockGetOAuthToken.mockClear();
  mockGetVolume.mockClear();
  mockNextTrack.mockClear();
  mockPreviousTrack.mockClear();
  mockSetVolume.mockClear();
  mockTogglePlay.mockClear();

  const wrapper = mount(
    <SpotifyWebPlayer
      callback={mockCallback}
      token={token}
      uris="spotify:album:7KvKuWUxxNPEU80c4i5AQk"
      {...props}
    />,
    // { attachTo: document.getElementById('react') },
  );

  window.onSpotifyWebPlaybackSDKReady();

  return wrapper;
};

describe('SpotifyWebPlayer', () => {
  beforeAll(async () => {
    window.Spotify = {
      Player: function Player({ getOAuthToken }) {
        this.addListener = mockAddListener;
        this.connect = mockConnect;
        this.disconnect = mockDisconnect;
        this.getCurrentState = mockGetCurrentState;
        this.getVolume = mockGetVolume;
        this.previousTrack = mockPreviousTrack;
        this.nextTrack = mockNextTrack;
        this.setVolume = mockSetVolume;
        this.togglePlay = mockTogglePlay;

        getOAuthToken(mockGetOAuthToken);
      },
    };

    fetchMock.get(/contains\?ids=*/, [true]);
    fetchMock.get('https://api.spotify.com/v1/me/player/devices', {
      devices: [
        {
          id: 'df17372ghs982js892js',
          name: 'Jest Player',
        },
      ],
    });
    fetchMock.get('https://api.spotify.com/v1/me/player', () => playerStatusResponse);
    fetchMock.delete('https://api.spotify.com/v1/me/tracks', 200);
    fetchMock.put('*', 204);
    fetchMock.post('*', 204);
    fetchMock.put('https://api.spotify.com/v1/me/tracks', 200);
  });

  describe('Error listeners', () => {
    let wrapper;

    beforeAll(() => {
      fetchMock.resetHistory();
      wrapper = setup();
    });

    beforeEach(() => {
      mockCallback.mockClear();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it('should handle `authentication_error`', async () => {
      const [authenticationType, authenticationFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'authentication_error',
      );
      authenticationFn({ type: authenticationType, message: 'Failed to authenticate' });

      await skipEventLoop();

      expect(wrapper.state().status).toBe(STATUS.ERROR);
      expect(wrapper.state().error).toBe('Failed to authenticate');
      expect(wrapper.state().errorType).toBe('authentication_error');
      expect(mockDisconnect).toHaveBeenCalledTimes(1);

      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('should handle `account_error`', async () => {
      const [accountType, accountFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'account_error',
      );
      accountFn({ type: accountType, message: 'Failed to validate Spotify account' });
      await skipEventLoop();

      expect(wrapper.state().status).toBe(STATUS.ERROR);
      expect(wrapper.state().error).toBe('Failed to validate Spotify account');
      expect(wrapper.state().errorType).toBe('account_error');
      expect(mockDisconnect).toHaveBeenCalledTimes(2);

      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('should handle `playback_error`', async () => {
      const [playbackType, playbackFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'playback_error',
      );
      playbackFn({ type: playbackType, message: 'Failed to perform playback' });

      await skipEventLoop();

      expect(wrapper.state().status).toBe(STATUS.ERROR);
      expect(wrapper.state().error).toBe('Failed to perform playback');
      expect(wrapper.state().errorType).toBe('playback_error');

      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('should handle `initialization_error`', async () => {
      const [initializationType, initializationFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'initialization_error',
      );
      initializationFn({ type: initializationType, message: 'Failed to initialize' });

      await skipEventLoop();

      expect(wrapper.state().status).toBe(STATUS.UNSUPPORTED);
      expect(wrapper.state().error).toBe('Failed to initialize');
      expect(wrapper.state().errorType).toBe('initialization_error');
      expect(mockDisconnect).toHaveBeenCalledTimes(3);

      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Device listeners', () => {
    let wrapper;

    beforeAll(() => {
      fetchMock.resetHistory();
      wrapper = setup();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it('should handle `ready`', () => {
      const [, readyFn] = mockAddListener.mock.calls.find(d => d[0] === 'ready');

      readyFn({ device_id: deviceId });

      expect(wrapper.state().status).toBe(STATUS.READY);
      expect(wrapper.state().error).toBe('');
      expect(wrapper.state().errorType).toBe('');
    });

    it('should handle `not_ready`', () => {
      const [, notReadyFn] = mockAddListener.mock.calls.find(d => d[0] === 'not_ready');

      notReadyFn({});

      expect(wrapper.state().status).toBe(STATUS.IDLE);
      expect(wrapper.state().error).toBe('');
      expect(wrapper.state().errorType).toBe('');
    });

    it('should handle `player_state_changed`', async () => {
      const [, stateChangeFn] = mockAddListener.mock.calls.find(
        d => d[0] === 'player_state_changed',
      );

      await stateChangeFn({
        ...playerState,
        paused: false,
      });
      jest.runOnlyPendingTimers();

      await skipEventLoop();

      expect(wrapper.state('position')).toBe(79.1);
      expect(wrapper.state('isPlaying')).toBeTrue();
      expect(wrapper.state('isActive')).toBeTrue();
    });
  });

  describe('With the local player', () => {
    let wrapper;

    beforeAll(() => {
      fetchMock.resetHistory();
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 6,
        height: 50,
        top: 0,
        left: 900,
        bottom: 50,
        right: 0,
      }));

      wrapper = setup({ autoPlay: true, showSaveIcon: true });
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it('should initialize the token', () => {
      expect(mockGetOAuthToken).toHaveBeenCalledWith(token);
    });

    it('should render a loader', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the full UI', async () => {
      const [, readyFn] = mockAddListener.mock.calls.find(d => d[0] === 'ready');
      readyFn({ device_id: deviceId });

      await updatePlayer();
      await skipEventLoop();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
    });

    it('should handle Volume changes', () => {
      wrapper.find('Volume button').simulate('click');

      wrapper
        .find('.rrs__track')
        .simulate('click', { clientX: 910, clientY: 25, currentTarget: {} });
      jest.runOnlyPendingTimers();

      wrapper.update();

      expect(wrapper.state('volume')).toBe(0.5);
      expect(mockSetVolume).toHaveBeenCalledWith(0.5);
      expect(wrapper.find('VolumeLow')).toExist();

      wrapper.find('Volume button').simulate('click');

      wrapper
        .find('.rrs__track')
        .simulate('click', { clientX: 910, clientY: 50, currentTarget: {} });
      jest.runOnlyPendingTimers();

      wrapper.update();

      expect(wrapper.state('volume')).toBe(0);
      expect(mockSetVolume).toHaveBeenCalledWith(0);
      expect(wrapper.find('VolumeMute')).toExist();
    });

    it('should handle Control clicks', async () => {
      // Play the previous track
      wrapper.find('[aria-label="Previous Track"]').simulate('click');
      expect(mockPreviousTrack).toHaveBeenCalled();

      // Play the next track
      wrapper.find('[aria-label="Next Track"]').simulate('click');
      expect(mockNextTrack).toHaveBeenCalled();

      wrapper.find('[aria-label="Pause"]').simulate('click');
      playerStateResponse = playerState;
      await skipEventLoop();

      expect(wrapper.state('isPlaying')).toBe(false);
    });

    it('should handle Info clicks', async () => {
      wrapper.find('Info button').simulate('click');
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/tracks');
      expect(fetchMock.lastCall()[1].body).toBe('["6KUjwoHktuX3du8laPVfO8"]');
      expect(fetchMock.lastCall()[1].method).toBe('DELETE');

      await skipEventLoop();

      wrapper.find('Info button').simulate('click');
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/tracks');
      expect(fetchMock.lastCall()[1].body).toEqual('{"ids":["6KUjwoHktuX3du8laPVfO8"]}');
      expect(fetchMock.lastCall()[1].method).toBe('PUT');
    });
  });

  describe('With an external device', () => {
    let wrapper;

    beforeAll(async () => {
      fetchMock.resetHistory();
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 6,
        height: 50,
        top: 0,
        left: 900,
        bottom: 50,
        right: 0,
      }));

      wrapper = setup({
        uris: ['spotify:track:2ViHeieFA3iPmsBya2NDFl', 'spotify:track:5zq709Rk69kjzCDdNthSbK'],
        persistDeviceSelection: true,
      });

      const [, readyFn] = mockAddListener.mock.calls.find(d => d[0] === 'ready');
      readyFn({ device_id: deviceId });

      await skipEventLoop();
      wrapper.update();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it('should handle Device selection', async () => {
      wrapper.find('Devices button').simulate('click');
      expect(wrapper.find('ClickOutside button')).toHaveText('Jest Player');

      wrapper.find('ClickOutside button').simulate('click');

      expect(wrapper.state('currentDeviceId')).toBe('df17372ghs982js892js');
      expect(wrapper.state('deviceId')).toBe('19ks98hfbxc53vh34jd');
    });

    it('should handle Volume changes', async () => {
      playerStatusResponse = {
        ...playerStatus,
        device: {
          ...playerStatus.device,
          volume_percent: 60,
        },
      };
      wrapper.find('Volume button').simulate('click');

      wrapper
        .find('.rrs__track')
        .simulate('click', { clientX: 910, clientY: 20, currentTarget: {} });

      jest.runOnlyPendingTimers();
      await skipEventLoop();

      expect(wrapper.state('volume')).toBe(0.6);
      expect(fetchMock.calls(d => d.endsWith('volume_percent=60'))).toBeTruthy();
    });

    it('should handle Control clicks', async () => {
      // reset the response (playing)
      playerStatusResponse = {
        ...playerStatus,
        is_playing: true,
      };

      wrapper.find('[aria-label="Play"]').simulate('click');
      expect(fetchMock.calls(d => d.indexOf('/play?') > 0)).toBeTruthy();

      // waits for the play request
      await skipEventLoop();
      // runs the sync timeout
      jest.runOnlyPendingTimers();
      // waits for the sync request
      await skipEventLoop();

      expect(wrapper.state('isPlaying')).toBe(true);

      // Play the previous track
      wrapper.find('[aria-label="Previous Track"]').simulate('click');
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player/previous');

      jest.runOnlyPendingTimers();
      await skipEventLoop();

      // it should have called a player update
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player');

      // Play the next track
      wrapper.find('[aria-label="Next Track"]').simulate('click');
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player/next');

      jest.runOnlyPendingTimers();
      await skipEventLoop();

      // it should have called a player update
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player');

      wrapper.find('[aria-label="Pause"]').simulate('click');
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player/pause');

      // reset the response again (paused)
      playerStatusResponse = playerStatus;

      jest.runOnlyPendingTimers();
      await skipEventLoop();

      // it should have called a player update
      expect(fetchMock.lastCall()[0]).toBe('https://api.spotify.com/v1/me/player');

      expect(wrapper.state('isPlaying')).toBe(false);
    });
  });

  describe('with control props', () => {
    let wrapper;

    beforeAll(async () => {
      fetchMock.resetHistory();
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        width: 6,
        height: 50,
        top: 0,
        left: 900,
        bottom: 50,
        right: 0,
      }));

      wrapper = setup({
        play: true,
      });

      const [, readyFn] = mockAddListener.mock.calls.find(d => d[0] === 'ready');
      readyFn({ device_id: deviceId });

      await skipEventLoop();
      wrapper.update();
    });

    afterAll(() => {
      wrapper.unmount();
    });

    it('should honor the play props ', () => {
      expect(wrapper.state('isPlaying')).toBeTrue();
    });

    it('should respond to play prop change', async () => {
      wrapper.setProps({ play: false });
      await skipEventLoop();

      expect(wrapper.state('isPlaying')).toBeFalse();
    });
  });
});
