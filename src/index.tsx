import * as React from 'react';

import {
  getDevices,
  getPlaybackState,
  next,
  pause,
  play,
  previous,
  seek,
  setDevice,
  setVolume,
} from './spotify';
import { getMergedStyles } from './styles';
import { getSpotifyURIType, isEqualArray, loadScript, validateURI, STATUS, TYPE } from './utils';

import {
  PlayOptions,
  Props,
  SpotifyDevice,
  SpotifyPlayerStatus,
  State,
  StylesOptions,
  WebPlaybackAlbum,
  WebPlaybackError,
  WebPlaybackImage,
  WebPlaybackPlayer,
  WebPlaybackReady,
  WebPlaybackState,
} from './types';

import Actions from './components/Actions';
import Content from './components/Content';
import Controls from './components/Controls';
import ErrorMessage from './components/ErrorMessage';
import Info from './components/Info';
import Loader from './components/Loader';
import Player from './components/Player';
import Slider from './components/Slider';

class SpotifyWebPlayer extends React.PureComponent<Props, State> {
  private isActive = false;
  private emptyTrack = {
    artists: '',
    durationMs: 0,
    id: '',
    image: '',
    name: '',
    uri: '',
  };
  private hasNewToken = false;
  private player?: WebPlaybackPlayer;
  private playerProgressInterval?: number;
  private playerSyncInterval?: number;
  private syncTimeout?: number;
  private seekUpdateInterval = 100;
  private readonly styles: StylesOptions;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentDeviceId: '',
      deviceId: '',
      devices: [],
      error: '',
      errorType: '',
      isActive: false,
      isInitializing: false,
      isMagnified: false,
      isPlaying: false,
      isSaved: false,
      isUnsupported: false,
      needsUpdate: false,
      nextTracks: [],
      position: 0,
      previousTracks: [],
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: 1,
    };

    this.styles = getMergedStyles(props.styles);
  }

  static defaultProps = {
    callback: () => undefined,
    magnifySliderOnHover: false,
    name: 'Spotify Web Player',
    showSaveIcon: false,
    syncExternalDeviceInterval: 5,
    syncExternalDevice: false,
  };

  public async componentDidMount() {
    this.isActive = true;
    this.updateState({ status: STATUS.INITIALIZING });

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = this.initializePlayer;

    await loadScript({
      defer: true,
      id: 'spotify-player',
      source: 'https://sdk.scdn.co/spotify-player.js',
    });
  }

  public async componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      currentDeviceId,
      deviceId,
      error,
      isInitializing,
      isPlaying,
      status,
      track,
    } = this.state;
    const {
      autoPlay,
      callback,
      offset,
      play: playProp,
      showSaveIcon,
      syncExternalDevice,
      token,
      uris,
    } = this.props;
    const isReady = prevState.status !== STATUS.READY && status === STATUS.READY;
    const changedURIs = Array.isArray(uris)
      ? !isEqualArray(prevProps.uris, uris)
      : prevProps.uris !== uris;

    const canPlay = !!currentDeviceId && !!(this.playOptions.context_uri || this.playOptions.uris);
    const shouldPlay = (changedURIs && isPlaying) || !!(isReady && (autoPlay || playProp));

    if (canPlay && shouldPlay) {
      await play({ deviceId: currentDeviceId, offset, ...this.playOptions }, token);

      /* istanbul ignore else */
      if (!isPlaying) {
        this.updateState({ isPlaying: true });
      }

      if (this.isExternalPlayer) {
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 600);
      }
    } else if (changedURIs && !isPlaying) {
      this.updateState({ needsUpdate: true });
    }

    if (prevState.status !== status) {
      callback!({
        ...this.state,
        type: TYPE.STATUS,
      });
    }

    if (prevState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      if (!isReady) {
        callback!({
          ...this.state,
          type: TYPE.DEVICE,
        });
      }

      await this.handleDeviceChange();
    }

    if (prevState.track.id !== track.id && track.id) {
      callback!({
        ...this.state,
        type: TYPE.TRACK,
      });

      if (showSaveIcon) {
        this.updateState({ isSaved: false });
      }
    }

    if (prevState.isPlaying !== isPlaying) {
      this.handlePlaybackStatus();
      await this.handleDeviceChange();

      callback!({
        ...this.state,
        type: TYPE.PLAYER,
      });
    }

    if (prevProps.token && prevProps.token !== token) {
      this.hasNewToken = true;

      if (!isInitializing) {
        this.initializePlayer();
      } else {
        this.hasNewToken = true;
      }
    }

    if (prevProps.play !== playProp && playProp !== isPlaying) {
      await this.togglePlay(true);
    }

    if (prevProps.offset !== offset) {
      await this.toggleOffset();
    }

    if (error === 'No player') {
      this.updateState({
        currentDeviceId: deviceId,
        error: '',
        errorType: '',
      });
    }

    if (prevState.isInitializing && !isInitializing) {
      if (error === 'authentication_error' && this.hasNewToken) {
        this.hasNewToken = false;
        this.initializePlayer();
      }

      if (syncExternalDevice && !uris) {
        const player: SpotifyPlayerStatus = await getPlaybackState(token);

        if (player && player.is_playing && player.device.id !== deviceId) {
          this.setExternalDevice(player.device.id);
        }
      }
    }
  }

  public componentWillUnmount() {
    this.isActive = false;

    /* istanbul ignore else */
    if (this.player) {
      this.player.disconnect();
    }

    clearInterval(this.playerSyncInterval);
    clearInterval(this.playerProgressInterval);
    clearTimeout(this.syncTimeout);
  }

  private get isExternalPlayer(): boolean {
    const { currentDeviceId, deviceId, status } = this.state;

    return (currentDeviceId && currentDeviceId !== deviceId) || status === STATUS.UNSUPPORTED;
  }

  private get playOptions(): PlayOptions {
    const { uris } = this.props;

    const response: PlayOptions = {
      context_uri: undefined,
      uris: undefined,
    };

    /* istanbul ignore else */
    if (uris) {
      const ids = Array.isArray(uris) ? uris : [uris];

      if (ids.length > 1 && getSpotifyURIType(ids[0]) === 'track') {
        response.uris = ids.filter((d) => validateURI(d) && getSpotifyURIType(d) === 'track');
      } else {
        // eslint-disable-next-line prefer-destructuring
        response.context_uri = ids[0];
      }
    }

    return response;
  }

  private handleChangeRange = async (position: number) => {
    const { track } = this.state;
    const { token } = this.props;

    try {
      const percentage = position / 100;

      if (this.isExternalPlayer) {
        await seek(Math.round(track.durationMs * percentage), token);

        this.updateState({
          position,
          progressMs: Math.round(track.durationMs * percentage),
        });
      } else if (this.player) {
        const state = (await this.player.getCurrentState()) as WebPlaybackState;

        if (state) {
          await this.player.seek(
            Math.round(state.track_window.current_track.duration_ms * percentage),
          );
        } else {
          this.updateState({ position: 0 });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleClickTogglePlay = async () => {
    try {
      await this.togglePlay();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleClickPrevious = async () => {
    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        const { token } = this.props;

        await previous(token);
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        await this.player.previousTrack();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleClickNext = async () => {
    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        const { token } = this.props;

        await next(token);
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        await this.player.nextTrack();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleClickDevice = async (deviceId: string) => {
    const { isUnsupported } = this.state;
    const { token } = this.props;

    this.updateState({ currentDeviceId: deviceId });

    try {
      await setDevice(deviceId, token);

      /* istanbul ignore else */
      if (isUnsupported) {
        await this.togglePlay(true);
        await this.syncDevice();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private async handleDeviceChange() {
    const { isPlaying } = this.state;
    const { syncExternalDeviceInterval } = this.props;

    try {
      if (this.isExternalPlayer && isPlaying && !this.playerSyncInterval) {
        await this.syncDevice();

        this.playerSyncInterval = window.setInterval(
          this.syncDevice,
          syncExternalDeviceInterval! * 1000,
        );
      }

      if ((!isPlaying || !this.isExternalPlayer) && this.playerSyncInterval) {
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = undefined;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  private handleFavoriteStatusChange = (isSaved: boolean) => {
    const { callback } = this.props;

    this.updateState({ isSaved });
    callback!({
      ...{
        ...this.state,
        isSaved,
      },
      type: TYPE.TRACK,
    });
  };

  private handlePlaybackStatus() {
    const { isPlaying } = this.state;

    if (isPlaying) {
      /* istanbul ignore else */
      if (!this.playerProgressInterval) {
        this.playerProgressInterval = window.setInterval(
          this.updateSeekBar,
          this.seekUpdateInterval,
        );
      }
    } else if (this.playerProgressInterval) {
      clearInterval(this.playerProgressInterval);
      this.playerProgressInterval = undefined;
    }
  }

  private handlePlayerErrors = async (type: string, message: string) => {
    const { status } = this.state;
    const isPlaybackError = type === 'playback_error';
    const isInitializationError = type === 'initialization_error';
    let nextStatus = status;

    if (this.player && !isPlaybackError) {
      await this.player.disconnect();
    }

    if (isInitializationError) {
      nextStatus = STATUS.UNSUPPORTED;
    }

    if (!isInitializationError && !isPlaybackError) {
      nextStatus = STATUS.ERROR;
    }

    this.updateState({
      error: message,
      errorType: type,
      isInitializing: false,
      isUnsupported: isInitializationError,
      status: nextStatus,
    });
  };

  private handlePlayerStateChanges = async (state: WebPlaybackState | null) => {
    try {
      /* istanbul ignore else */
      if (state) {
        const isPlaying = !state.paused;
        const { album, artists, duration_ms, id, name, uri } = state.track_window.current_track;
        const volume = await this.player!.getVolume();
        const track = {
          artists: artists.map((d) => d.name).join(', '),
          durationMs: duration_ms,
          id,
          image: this.setAlbumImage(album),
          name,
          uri,
        };

        this.updateState({
          error: '',
          errorType: '',
          isActive: true,
          isPlaying,
          nextTracks: state.track_window.next_tracks,
          previousTracks: state.track_window.previous_tracks,
          track,
          volume,
        });
      } else if (this.isExternalPlayer) {
        await this.syncDevice();
      } else {
        this.updateState({
          isActive: false,
          isPlaying: false,
          nextTracks: [],
          position: 0,
          previousTracks: [],
          track: {
            artists: '',
            durationMs: 0,
            id: '',
            image: '',
            name: '',
            uri: '',
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handlePlayerStatus = async ({ device_id }: WebPlaybackReady) => {
    const { currentDeviceId, devices } = await this.initializeDevices(device_id);

    this.updateState({
      currentDeviceId,
      deviceId: device_id,
      devices,
      isInitializing: false,
      status: device_id ? STATUS.READY : STATUS.IDLE,
    });
  };

  private handleToggleMagnify = () => {
    const { magnifySliderOnHover } = this.props;

    if (magnifySliderOnHover) {
      this.updateState((prevState: State) => {
        return { isMagnified: !prevState.isMagnified };
      });
    }
  };

  private async initializeDevices(id: string) {
    const { persistDeviceSelection, token } = this.props;
    const { devices } = await getDevices(token);
    let currentDeviceId = id;

    if (persistDeviceSelection) {
      const savedDeviceId = sessionStorage.getItem('rswpDeviceId');

      if (!savedDeviceId || !devices.find((d: SpotifyDevice) => d.id === savedDeviceId)) {
        sessionStorage.setItem('rswpDeviceId', currentDeviceId);
      } else {
        currentDeviceId = savedDeviceId;
      }
    }

    return { currentDeviceId, devices };
  }

  private initializePlayer = () => {
    const { name, token } = this.props;

    this.updateState({ isInitializing: true });

    // @ts-ignore
    this.player = new window.Spotify.Player({
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      name,
    }) as WebPlaybackPlayer;

    this.player.addListener('ready', this.handlePlayerStatus);
    this.player.addListener('not_ready', this.handlePlayerStatus);
    this.player.addListener('player_state_changed', this.handlePlayerStateChanges);
    this.player.addListener('initialization_error', (error: WebPlaybackError) =>
      this.handlePlayerErrors('initialization_error', error.message),
    );
    this.player.addListener('authentication_error', (error: WebPlaybackError) =>
      this.handlePlayerErrors('authentication_error', error.message),
    );
    this.player.addListener('account_error', (error: WebPlaybackError) =>
      this.handlePlayerErrors('account_error', error.message),
    );
    this.player.addListener('playback_error', (error: WebPlaybackError) =>
      this.handlePlayerErrors('playback_error', error.message),
    );

    this.player.connect();
  };

  private setAlbumImage = (album: WebPlaybackAlbum): string => {
    const width = Math.min(...album.images.map((d) => d.width));
    const thumb: WebPlaybackImage =
      album.images.find((d) => d.width === width) || ({} as WebPlaybackImage);

    return thumb.url;
  };

  private setExternalDevice = (id: string) => {
    this.updateState({ currentDeviceId: id, isPlaying: true });
  };

  private setVolume = async (volume: number) => {
    const { token } = this.props;

    /* istanbul ignore else */
    if (this.isExternalPlayer) {
      await setVolume(Math.round(volume * 100), token);
      await this.syncDevice();
    } else if (this.player) {
      await this.player.setVolume(volume);
    }

    this.updateState({ volume });
  };

  private syncDevice = async () => {
    if (!this.isActive) {
      return;
    }

    const { token } = this.props;

    try {
      const player: SpotifyPlayerStatus = await getPlaybackState(token);
      let track = this.emptyTrack;

      if (!player) {
        throw new Error('No player');
      }

      /* istanbul ignore else */
      if (player.item) {
        track = {
          artists: player.item.artists.map((d) => d.name).join(', '),
          durationMs: player.item.duration_ms,
          id: player.item.id,
          image: this.setAlbumImage(player.item.album),
          name: player.item.name,
          uri: player.item.uri,
        };
      }

      this.updateState({
        error: '',
        errorType: '',
        isActive: true,
        isPlaying: player.is_playing,
        nextTracks: [],
        previousTracks: [],
        progressMs: player.item ? player.progress_ms : 0,
        status: STATUS.READY,
        track,
        volume: player.device.volume_percent / 100,
      });
    } catch (error) {
      this.updateState({
        error: error.message,
        errorType: 'player_status',
        status: STATUS.ERROR,
      });
    }
  };

  private toggleOffset = async () => {
    const { currentDeviceId, isPlaying } = this.state;
    const { offset, token, uris } = this.props;

    if (isPlaying && typeof offset === 'number' && Array.isArray(uris)) {
      await play({ deviceId: currentDeviceId, offset, uris }, token);
    }
  };

  private togglePlay = async (init = false) => {
    const { currentDeviceId, isPlaying, needsUpdate } = this.state;
    const { offset, token } = this.props;
    const shouldInitialize = init || needsUpdate;

    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        if (!isPlaying) {
          await play(
            {
              deviceId: currentDeviceId,
              offset,
              ...(shouldInitialize ? this.playOptions : undefined),
            },
            token,
          );
        } else {
          await pause(token);

          this.updateState({ isPlaying: false });
        }

        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        const playerState = await this.player.getCurrentState();

        if (
          (!playerState && !!(this.playOptions.context_uri || this.playOptions.uris)) ||
          (shouldInitialize && playerState && playerState.paused)
        ) {
          await play(
            {
              deviceId: currentDeviceId,
              offset,
              ...(shouldInitialize ? this.playOptions : undefined),
            },
            token,
          );
        } else {
          await this.player.togglePlay();
        }
      }

      if (needsUpdate) {
        this.updateState({ needsUpdate: false });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private updateSeekBar = async () => {
    if (!this.isActive) {
      return;
    }

    const { isPlaying, progressMs, track } = this.state;

    try {
      /* istanbul ignore else */
      if (isPlaying) {
        /* istanbul ignore else */
        if (this.isExternalPlayer) {
          let position = progressMs! / track.durationMs;
          position = Number.isFinite(position) ? position : 0;

          this.updateState({
            position: Number((position * 100).toFixed(1)),
            progressMs: progressMs! + this.seekUpdateInterval,
          });
        } else if (this.player) {
          const state = (await this.player.getCurrentState()) as WebPlaybackState;

          /* istanbul ignore else */
          if (state) {
            const position = state.position / state.track_window.current_track.duration_ms;

            this.updateState({ position: Number((position * 100).toFixed(1)) });
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private updateState = (state = {}) => {
    if (!this.isActive) {
      return;
    }

    this.setState(state);
  };

  public render() {
    const {
      currentDeviceId,
      deviceId,
      devices,
      error,
      errorType,
      isActive,
      isMagnified,
      isUnsupported,
      isPlaying,
      nextTracks,
      position,
      previousTracks,
      status,
      track,
      volume,
    } = this.state;
    const { name, showSaveIcon, token, updateSavedStatus } = this.props;
    const isReady = [STATUS.READY, STATUS.UNSUPPORTED].indexOf(status) >= 0;
    const isPlaybackError = errorType === 'playback_error';
    let output = <Loader styles={this.styles!} />;
    let info;

    if (isPlaybackError) {
      info = <p>{error}</p>;
    }

    if (isReady) {
      /* istanbul ignore else */
      if (!info) {
        info = (
          <Info
            handleFavoriteStatusChange={this.handleFavoriteStatusChange}
            showSaveIcon={showSaveIcon!}
            isActive={isActive}
            styles={this.styles}
            token={token}
            track={track}
            updateSavedStatus={updateSavedStatus}
          />
        );
      }

      output = (
        <React.Fragment>
          <div>{info}</div>
          <Controls
            isExternalDevice={this.isExternalPlayer}
            isPlaying={isPlaying}
            onClickNext={this.handleClickNext}
            onClickPrevious={this.handleClickPrevious}
            onClickTogglePlay={this.handleClickTogglePlay}
            nextTracks={nextTracks}
            previousTracks={previousTracks}
            styles={this.styles}
          />
          <Actions
            currentDeviceId={currentDeviceId}
            devices={devices}
            isDevicesOpen={isUnsupported && !deviceId}
            onClickDevice={this.handleClickDevice}
            setVolume={this.setVolume}
            styles={this.styles}
            volume={volume}
          />
        </React.Fragment>
      );
    }

    if (status === STATUS.ERROR) {
      output = (
        <ErrorMessage styles={this.styles}>
          {name}: {error}
        </ErrorMessage>
      );
    }

    return (
      <Player styles={this.styles}>
        {isReady && (
          <Slider
            isMagnified={isMagnified}
            onChangeRange={this.handleChangeRange}
            onToggleMagnify={this.handleToggleMagnify}
            position={position}
            styles={this.styles!}
          />
        )}
        <Content styles={this.styles}>{output}</Content>
      </Player>
    );
  }
}

export { STATUS, TYPE };

export default SpotifyWebPlayer;
