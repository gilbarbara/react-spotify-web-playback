/* eslint-disable camelcase */
import * as React from 'react';
import memoize from 'memoize-one';

import Actions from './components/Actions';
import Content from './components/Content';
import Controls from './components/Controls';
import ErrorMessage from './components/ErrorMessage';
import Info from './components/Info';
import Loader from './components/Loader';
import Player from './components/Player';
import Slider from './components/Slider';
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
import {
  PlayOptions,
  Props,
  SpotifyDevice,
  SpotifyPlayerCallback,
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
import {
  getSpotifyURIType,
  isEqualArray,
  loadSpotifyPlayer,
  parseVolume,
  round,
  STATUS,
  TYPE,
  validateURI,
} from './utils';

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

  private getPlayOptions = memoize((data): PlayOptions => {
    const playOptions: PlayOptions = {
      context_uri: undefined,
      uris: undefined,
    };

    /* istanbul ignore else */
    if (data) {
      const ids = Array.isArray(data) ? data : [data];

      if (!ids.every(d => validateURI(d))) {
        // eslint-disable-next-line no-console
        console.error('Invalid URI');

        return playOptions;
      }

      if (ids.some(d => getSpotifyURIType(d) === 'track')) {
        if (!ids.every(d => getSpotifyURIType(d) === 'track')) {
          // eslint-disable-next-line no-console
          console.warn("You can't mix tracks URIs with other types");
        }

        playOptions.uris = ids.filter(d => validateURI(d) && getSpotifyURIType(d) === 'track');
      } else {
        if (ids.length > 1) {
          // eslint-disable-next-line no-console
          console.warn("Albums, Artists, Playlists and Podcasts can't have multiple URIs");
        }

        // eslint-disable-next-line prefer-destructuring
        playOptions.context_uri = ids[0];
      }
    }

    return playOptions;
  });

  private hasNewToken = false;
  private player?: WebPlaybackPlayer;
  private playerProgressInterval?: number;
  private playerSyncInterval?: number;
  private ref = React.createRef<HTMLDivElement>();
  private seekUpdateInterval = 100;
  private readonly styles: StylesOptions;
  private syncTimeout?: number;

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
      playerPosition: 'bottom',
      position: 0,
      previousTracks: [],
      progressMs: 0,
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: parseVolume(props.initialVolume) || 1,
    };

    this.styles = getMergedStyles(props.styles);
  }

  // eslint-disable-next-line react/static-property-placement
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
    const { top = 0 } = this.ref.current?.getBoundingClientRect() || {};

    this.updateState({
      playerPosition: top > window.innerHeight / 2 ? 'bottom' : 'top',
      status: STATUS.INITIALIZING,
    });

    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = this.initializePlayer;
    } else {
      this.initializePlayer();
    }

    await loadSpotifyPlayer();
  }

  public async componentDidUpdate(previousProps: Props, previousState: State) {
    const { currentDeviceId, deviceId, error, isInitializing, isPlaying, status, track } =
      this.state;
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
    const isReady = previousState.status !== STATUS.READY && status === STATUS.READY;
    const changedURIs = Array.isArray(uris)
      ? !isEqualArray(previousProps.uris, uris)
      : previousProps.uris !== uris;
    const playOptions = this.getPlayOptions(uris);

    const canPlay = !!currentDeviceId && !!(playOptions.context_uri || playOptions.uris);
    const shouldPlay = (changedURIs && isPlaying) || !!(isReady && (autoPlay || playProp));

    if (canPlay && shouldPlay) {
      await play(token, { deviceId: currentDeviceId, offset, ...playOptions });

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

    if (previousState.status !== status) {
      callback!({
        ...this.state,
        type: TYPE.STATUS,
      });
    }

    if (previousState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      if (!isReady) {
        callback!({
          ...this.state,
          type: TYPE.DEVICE,
        });
      }

      await this.toggleSyncInterval(this.isExternalPlayer);
      await this.updateSeekBar();
    }

    if (previousState.track.id !== track.id && track.id) {
      callback!({
        ...this.state,
        type: TYPE.TRACK,
      });

      if (showSaveIcon) {
        this.updateState({ isSaved: false });
      }
    }

    if (previousState.isPlaying !== isPlaying) {
      this.toggleProgressBar();
      await this.toggleSyncInterval(this.isExternalPlayer);

      callback!({
        ...this.state,
        type: TYPE.PLAYER,
      });
    }

    if (token && previousProps.token !== token) {
      this.hasNewToken = true;

      if (!isInitializing) {
        this.initializePlayer();
      } else {
        this.hasNewToken = true;
      }
    }

    if (previousProps.play !== playProp && playProp !== isPlaying) {
      await this.togglePlay(!track.id);
    }

    if (previousProps.offset !== offset) {
      await this.toggleOffset();
    }

    if (previousState.isInitializing && !isInitializing) {
      if (error === 'authentication_error' && this.hasNewToken) {
        this.hasNewToken = false;
        this.initializePlayer();
      }

      if (syncExternalDevice && !uris) {
        const player: SpotifyPlayerStatus = await getPlaybackState(token);

        /* istanbul ignore else */
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

  private handleChangeRange = async (position: number) => {
    const { track } = this.state;
    const { callback, token } = this.props;
    let progress = 0;

    try {
      const percentage = position / 100;

      if (this.isExternalPlayer) {
        progress = Math.round(track.durationMs * percentage);
        await seek(token, progress);

        this.updateState({
          position,
          progressMs: progress,
        });
      } else if (this.player) {
        const state = (await this.player.getCurrentState()) as WebPlaybackState;

        if (state) {
          progress = Math.round(state.track_window.current_track.duration_ms * percentage);
          await this.player.seek(progress);

          this.updateState({
            position,
            progressMs: progress,
          });
        } else {
          this.updateState({ position: 0 });
        }
      }

      if (callback) {
        callback({
          ...this.state,
          type: TYPE.PROGRESS,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleClickTogglePlay = async () => {
    const { isActive } = this.state;

    try {
      await this.togglePlay(!this.isExternalPlayer && !isActive);
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
    const { autoPlay, persistDeviceSelection, token } = this.props;

    this.updateState({ currentDeviceId: deviceId });

    try {
      await setDevice(token, deviceId);

      /* istanbul ignore else */
      if (persistDeviceSelection) {
        sessionStorage.setItem('rswpDeviceId', deviceId);
      }

      /* istanbul ignore else */
      if (isUnsupported) {
        await this.syncDevice();

        const player: SpotifyPlayerStatus = await getPlaybackState(token);

        if (player && !player.is_playing && autoPlay) {
          await this.togglePlay(true);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  private handleFavoriteStatusChange = (status: boolean) => {
    const { isSaved } = this.state;
    const { callback } = this.props;

    this.updateState({ isSaved: status });

    /* istanbul ignore else */
    if (isSaved !== status) {
      callback!({
        ...{
          ...this.state,
          isSaved: status,
        },
        type: TYPE.FAVORITE,
      });
    }
  };

  private handlePlayerErrors = async (type: string, message: string) => {
    const { status } = this.state;
    const isPlaybackError = type === 'playback_error';
    const isInitializationError = type === 'initialization_error';
    let nextStatus = status;
    let devices: SpotifyDevice[] = [];

    if (this.player && !isPlaybackError) {
      await this.player.disconnect();
    }

    if (isInitializationError) {
      nextStatus = STATUS.UNSUPPORTED;

      const { token } = this.props;

      ({ devices = [] } = await getDevices(token));
    }

    if (!isInitializationError && !isPlaybackError) {
      nextStatus = STATUS.ERROR;
    }

    this.updateState({
      devices,
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
        const {
          paused,
          position,
          track_window: {
            current_track: { album, artists, duration_ms, id, name, uri },
            next_tracks,
            previous_tracks,
          },
        } = state;

        const isPlaying = !paused;
        const volume = await this.player!.getVolume();
        const track = {
          artists: artists.map(d => d.name).join(', '),
          durationMs: duration_ms,
          id,
          image: this.setAlbumImage(album),
          name,
          uri,
        };
        let trackState;

        if (position === 0) {
          trackState = {
            nextTracks: next_tracks,
            position: 0,
            previousTracks: previous_tracks,
            track,
          };
        }

        this.updateState({
          error: '',
          errorType: '',
          isActive: true,
          isPlaying,
          progressMs: position,
          volume: round(volume),
          ...trackState,
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
      this.updateState((previousState: State) => {
        return { isMagnified: !previousState.isMagnified };
      });
    }
  };

  private async initializeDevices(id: string) {
    const { persistDeviceSelection, token } = this.props;
    const { devices } = await getDevices(token);
    let currentDeviceId = id;

    if (persistDeviceSelection) {
      const savedDeviceId = sessionStorage.getItem('rswpDeviceId');

      /* istanbul ignore else */
      if (!savedDeviceId || !devices.some((d: SpotifyDevice) => d.id === savedDeviceId)) {
        sessionStorage.setItem('rswpDeviceId', currentDeviceId);
      } else {
        currentDeviceId = savedDeviceId;
      }
    }

    return { currentDeviceId, devices };
  }

  private initializePlayer = () => {
    const { volume } = this.state;
    const { name, token } = this.props;

    this.updateState({ isInitializing: true });

    // @ts-ignore
    this.player = new window.Spotify.Player({
      getOAuthToken: (callback: SpotifyPlayerCallback) => {
        callback(token);
      },
      name,
      volume,
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
    const width = Math.min(...album.images.map(d => d.width));
    const thumb: WebPlaybackImage =
      album.images.find(d => d.width === width) || ({} as WebPlaybackImage);

    return thumb.url;
  };

  private setExternalDevice = (id: string) => {
    this.updateState({ currentDeviceId: id, isPlaying: true });
  };

  private setVolume = async (volume: number) => {
    const { token } = this.props;

    /* istanbul ignore else */
    if (this.isExternalPlayer) {
      await setVolume(token, Math.round(volume * 100));
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

    const { deviceId } = this.state;
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
          artists: player.item.artists.map(d => d.name).join(', '),
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
        volume: parseVolume(player.device.volume_percent),
      });
    } catch (error) {
      const state = {
        isActive: false,
        isPlaying: false,
        position: 0,
        track: this.emptyTrack,
      };

      if (deviceId) {
        this.updateState({
          currentDeviceId: deviceId,
          ...state,
        });

        return;
      }

      this.updateState({
        error: error.message,
        errorType: 'player_status',
        status: STATUS.ERROR,
        ...state,
      });
    }
  };

  private async toggleSyncInterval(shouldSync: boolean) {
    const { syncExternalDeviceInterval } = this.props;

    try {
      if (this.isExternalPlayer && shouldSync && !this.playerSyncInterval) {
        await this.syncDevice();

        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = window.setInterval(
          this.syncDevice,
          syncExternalDeviceInterval! * 1000,
        );
      }

      if ((!shouldSync || !this.isExternalPlayer) && this.playerSyncInterval) {
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = undefined;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  private toggleProgressBar() {
    const { isPlaying } = this.state;

    /* istanbul ignore else */
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

  private toggleOffset = async () => {
    const { currentDeviceId, isPlaying } = this.state;
    const { offset, token, uris } = this.props;

    if (isPlaying && typeof offset === 'number' && Array.isArray(uris)) {
      await play(token, { deviceId: currentDeviceId, offset, uris });
    }
  };

  private togglePlay = async (init = false) => {
    const { currentDeviceId, isPlaying, needsUpdate } = this.state;
    const { offset, token, uris } = this.props;
    const shouldInitialize = init || needsUpdate;
    const playOptions = this.getPlayOptions(uris);

    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        if (!isPlaying) {
          await play(token, {
            deviceId: currentDeviceId,
            offset,
            ...(shouldInitialize ? playOptions : undefined),
          });
        } else {
          await pause(token);

          this.updateState({ isPlaying: false });
        }

        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        const playerState = await this.player.getCurrentState();

        // eslint-disable-next-line unicorn/prefer-ternary
        if (
          (!playerState && !!(playOptions.context_uri || playOptions.uris)) ||
          (shouldInitialize && playerState && playerState.paused)
        ) {
          await play(token, {
            deviceId: currentDeviceId,
            offset,
            ...(shouldInitialize ? playOptions : undefined),
          });
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

    const { progressMs, track } = this.state;

    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        let position = progressMs / track.durationMs;

        position = Number(((Number.isFinite(position) ? position : 0) * 100).toFixed(1));

        this.updateState({
          position,
          progressMs: progressMs + this.seekUpdateInterval,
        });
      } else if (this.player) {
        const state = (await this.player.getCurrentState()) as WebPlaybackState;

        /* istanbul ignore else */
        if (state) {
          const progress = state.position;
          const position = Number(
            ((progress / state.track_window.current_track.duration_ms) * 100).toFixed(1),
          );

          this.updateState({
            position,
            progressMs: progress + this.seekUpdateInterval,
          });
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
      isPlaying,
      isUnsupported,
      nextTracks,
      playerPosition,
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
            isActive={isActive}
            onFavoriteStatusChange={this.handleFavoriteStatusChange}
            showSaveIcon={showSaveIcon!}
            styles={this.styles}
            token={token}
            track={track}
            updateSavedStatus={updateSavedStatus}
          />
        );
      }

      output = (
        <>
          <div>{info}</div>
          <Controls
            isExternalDevice={this.isExternalPlayer}
            isPlaying={isPlaying}
            nextTracks={nextTracks}
            onClickNext={this.handleClickNext}
            onClickPrevious={this.handleClickPrevious}
            onClickTogglePlay={this.handleClickTogglePlay}
            previousTracks={previousTracks}
            styles={this.styles}
          />
          <Actions
            currentDeviceId={currentDeviceId}
            deviceId={deviceId}
            devices={devices}
            isDevicesOpen={isUnsupported && !deviceId}
            onClickDevice={this.handleClickDevice}
            playerPosition={playerPosition}
            setVolume={this.setVolume}
            styles={this.styles}
            volume={volume}
          />
        </>
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
      <Player ref={this.ref} styles={this.styles}>
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

export * from './types';

export default SpotifyWebPlayer;
