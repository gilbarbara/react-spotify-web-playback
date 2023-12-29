/* eslint-disable camelcase */
import { createRef, PureComponent, ReactNode } from 'react';
import isEqual from '@gilbarbara/deep-equal';
import memoize from 'memoize-one';

import { getLocale, getMergedStyles, getSpotifyURIType } from '~/modules/getters';
import {
  convertTrack,
  getAlbumImage,
  getRepeatState,
  getURIs,
  loadSpotifyPlayer,
  parseVolume,
  round,
  validateURI,
} from '~/modules/helpers';
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
} from '~/modules/spotify';
import { put } from '~/modules/styled';

import Actions from '~/components/Actions';
import Controls from '~/components/Controls';
import Devices from '~/components/Devices';
import ErrorMessage from '~/components/ErrorMessage';
import Info from '~/components/Info';
import Loader from '~/components/Loader';
import Player from '~/components/Player';
import Volume from '~/components/Volume';
import Wrapper from '~/components/Wrapper';

import { ERROR_TYPE, STATUS, TYPE } from '~/constants';

import {
  CallbackState,
  ErrorType,
  Locale,
  PlayOptions,
  Props,
  SpotifyArtist,
  SpotifyDevice,
  SpotifyPlayerCallback,
  State,
  Status,
  StylesOptions,
} from './types';

put('.PlayerRSWP', {
  boxSizing: 'border-box',
  fontSize: 'inherit',
  width: '100%',

  '*': {
    boxSizing: 'border-box',
  },

  p: {
    margin: 0,
  },
});

put('.ButtonRSWP', {
  appearance: 'none',
  background: 'transparent',
  border: 0,
  borderRadius: 0,
  color: 'inherit',
  cursor: 'pointer',
  display: 'inline-flex',
  lineHeight: 1,
  padding: 0,

  ':focus': {
    outlineColor: '#000',
    outlineOffset: 3,
  },
});

class SpotifyWebPlayer extends PureComponent<Props, State> {
  private isMounted = false;
  private emptyTrack = {
    artists: [] as SpotifyArtist[],
    durationMs: 0,
    id: '',
    image: '',
    name: '',
    uri: '',
  };

  private locale: Locale;
  private player?: Spotify.Player;
  private playerProgressInterval?: number;
  private playerSyncInterval?: number;
  private ref = createRef<HTMLDivElement>();
  private renderInlineActions = false;
  private resizeTimeout?: number;
  private seekUpdateInterval = 100;
  private styles: StylesOptions;
  private syncTimeout?: number;

  private getPlayOptions = memoize((ids: string[]): PlayOptions => {
    const playOptions: PlayOptions = {
      context_uri: undefined,
      uris: undefined,
    };

    /* istanbul ignore else */
    if (ids) {
      if (!ids.every(d => validateURI(d))) {
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

  constructor(props: Props) {
    super(props);

    this.state = {
      currentDeviceId: '',
      deviceId: '',
      devices: [],
      error: '',
      errorType: null,
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
      repeat: 'off',
      shuffle: false,
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: parseVolume(props.initialVolume) || 1,
    };

    this.locale = getLocale(props.locale);

    this.styles = getMergedStyles(props.styles);
  }

  static defaultProps = {
    autoPlay: false,
    initialVolume: 1,
    magnifySliderOnHover: false,
    name: 'Spotify Web Player',
    persistDeviceSelection: false,
    showSaveIcon: false,
    syncExternalDeviceInterval: 5,
    syncExternalDevice: false,
  };

  public async componentDidMount() {
    this.isMounted = true;
    const { top = 0 } = this.ref.current?.getBoundingClientRect() ?? {};

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

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  public async componentDidUpdate(previousProps: Props, previousState: State) {
    const { currentDeviceId, deviceId, isInitializing, isPlaying, repeat, shuffle, status, track } =
      this.state;
    const {
      autoPlay,
      layout,
      locale,
      offset,
      play: playProp,
      showSaveIcon,
      styles,
      syncExternalDevice,
      uris,
    } = this.props;
    const isReady = previousState.status !== STATUS.READY && status === STATUS.READY;
    const playOptions = this.getPlayOptions(getURIs(uris));

    const canPlay = !!currentDeviceId && !!(playOptions.context_uri ?? playOptions.uris);
    const shouldPlay = isReady && (autoPlay || playProp);

    if (canPlay && shouldPlay) {
      await this.togglePlay(true);

      /* istanbul ignore else */
      if (!isPlaying) {
        this.updateState({ isPlaying: true });
      }

      if (this.isExternalPlayer) {
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 600);
      }
    } else if (!isEqual(previousProps.uris, uris)) {
      if (isPlaying || playProp) {
        await this.togglePlay(true);
      } else {
        this.updateState({ needsUpdate: true });
      }
    } else if (previousProps.play !== playProp && playProp !== isPlaying) {
      await this.togglePlay(!track.id);
    }

    if (previousState.status !== status) {
      this.handleCallback({
        ...this.state,
        type: TYPE.STATUS,
      });
    }

    if (previousState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      if (!isReady) {
        this.handleCallback({
          ...this.state,
          type: TYPE.DEVICE,
        });
      }

      await this.toggleSyncInterval(this.isExternalPlayer);
      await this.updateSeekBar();
    }

    if (previousState.track.id !== track.id && track.id) {
      this.handleCallback({
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

      this.handleCallback({
        ...this.state,
        type: TYPE.PLAYER,
      });
    }

    if (previousState.repeat !== repeat || previousState.shuffle !== shuffle) {
      this.handleCallback({
        ...this.state,
        type: TYPE.PLAYER,
      });
    }

    if (previousProps.offset !== offset) {
      await this.toggleOffset();
    }

    if (previousState.isInitializing && !isInitializing) {
      if (syncExternalDevice && !uris) {
        const playerState = await getPlaybackState(this.token);

        /* istanbul ignore else */
        if (playerState?.is_playing && playerState.device.id !== deviceId) {
          this.setExternalDevice(playerState.device.id ?? '');
        }
      }
    }

    if (previousProps.layout !== layout) {
      this.handleResize();
    }

    if (!isEqual(previousProps.locale, locale)) {
      this.locale = getLocale(locale);
    }

    if (!isEqual(previousProps.styles, styles)) {
      this.styles = getMergedStyles(styles);
    }
  }

  public async componentWillUnmount() {
    this.isMounted = false;

    /* istanbul ignore else */
    if (this.player) {
      this.player.disconnect();
    }

    clearInterval(this.playerSyncInterval);
    clearInterval(this.playerProgressInterval);
    clearTimeout(this.syncTimeout);

    window.removeEventListener('resize', this.handleResize);
  }

  private handleCallback(state: CallbackState): void {
    const { callback } = this.props;

    if (callback) {
      callback(state);
    }
  }

  private handleChangeRange = async (position: number) => {
    const { track } = this.state;
    const { callback } = this.props;
    let progress = 0;

    try {
      const percentage = position / 100;

      let stateChanges = {};

      if (this.isExternalPlayer) {
        progress = Math.round(track.durationMs * percentage);

        await seek(this.token, progress);

        stateChanges = {
          position,
          progressMs: progress,
        };
      } else if (this.player) {
        const state = await this.player.getCurrentState();

        if (state) {
          progress = Math.round(state.track_window.current_track.duration_ms * percentage);
          await this.player.seek(progress);

          stateChanges = {
            position,
            progressMs: progress,
          };
        } else {
          stateChanges = { position: 0 };
        }
      }

      this.updateState(stateChanges);

      if (callback) {
        callback({
          ...this.state,
          ...stateChanges,
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
        await previous(this.token);
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
        await next(this.token);
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
    const { autoPlay, persistDeviceSelection } = this.props;

    this.updateState({ currentDeviceId: deviceId });

    try {
      await setDevice(this.token, deviceId);

      /* istanbul ignore else */
      if (persistDeviceSelection) {
        sessionStorage.setItem('rswpDeviceId', deviceId);
      }

      /* istanbul ignore else */
      if (isUnsupported) {
        await this.syncDevice();

        const playerState = await getPlaybackState(this.token);

        if (playerState && !playerState.is_playing && autoPlay) {
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

    this.updateState({ isSaved: status });

    /* istanbul ignore else */
    if (isSaved !== status) {
      this.handleCallback({
        ...this.state,
        isSaved: status,
        type: TYPE.FAVORITE,
      });
    }
  };

  private handlePlayerErrors = async (type: ErrorType, message: string) => {
    const { status } = this.state;
    const isPlaybackError = type === ERROR_TYPE.PLAYBACK;
    const isInitializationError = type === ERROR_TYPE.INITIALIZATION;

    let nextStatus = status;
    let devices: SpotifyDevice[] = [];

    if (this.player && !isPlaybackError) {
      this.player.disconnect();
      this.player = undefined;
    }

    if (isInitializationError) {
      nextStatus = STATUS.UNSUPPORTED;

      ({ devices = [] } = await getDevices(this.token));
    } else if (!isPlaybackError) {
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

  private handlePlayerStateChanges = async (state: Spotify.PlaybackState) => {
    try {
      /* istanbul ignore else */
      if (state) {
        const {
          paused,
          position,
          repeat_mode,
          shuffle,
          track_window: { current_track, next_tracks, previous_tracks },
        } = state;

        const isPlaying = !paused;
        const volume = (await this.player?.getVolume()) ?? 100;
        let trackState = {};

        if (position === 0 && current_track) {
          trackState = {
            nextTracks: next_tracks.map(convertTrack),
            position: 0,
            previousTracks: previous_tracks.map(convertTrack),
            track: convertTrack(current_track),
          };
        }

        this.updateState({
          error: '',
          errorType: null,
          isActive: true,
          isPlaying,
          progressMs: position,
          repeat: getRepeatState(repeat_mode),
          shuffle,
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
            artists: [],
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

  private handlePlayerStatus = async ({ device_id }: Spotify.WebPlaybackInstance) => {
    const { currentDeviceId, devices } = await this.initializeDevices(device_id);

    this.updateState({
      currentDeviceId,
      deviceId: device_id,
      devices,
      isInitializing: false,
      status: device_id ? STATUS.READY : STATUS.IDLE,
    });
  };

  private handleResize = () => {
    const { layout = 'responsive' } = this.props;

    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = window.setTimeout(() => {
      this.renderInlineActions = window.innerWidth >= 768 && layout === 'responsive';
      this.forceUpdate();
    }, 100);
  };

  private handleToggleMagnify = () => {
    const { magnifySliderOnHover } = this.props;

    if (magnifySliderOnHover) {
      this.updateState(previousState => {
        return { isMagnified: !previousState.isMagnified };
      });
    }
  };

  private get token(): string {
    const { token } = this.props;

    return token;
  }

  private async initializeDevices(id: string) {
    const { persistDeviceSelection } = this.props;
    const { devices } = await getDevices(this.token);
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
    const {
      getOAuthToken = (callback: SpotifyPlayerCallback) => {
        callback(this.token);
      },
      getPlayer,
      name = 'Spotify Web Player',
    } = this.props;

    if (!window.Spotify) {
      return;
    }

    this.updateState({
      error: '',
      errorType: null,
      isInitializing: true,
    });

    this.player = new window.Spotify.Player({
      getOAuthToken,
      name,
      volume,
    });

    this.player.addListener('ready', this.handlePlayerStatus);
    this.player.addListener('not_ready', this.handlePlayerStatus);
    this.player.addListener('player_state_changed', this.handlePlayerStateChanges);
    this.player.addListener('initialization_error', error =>
      this.handlePlayerErrors(ERROR_TYPE.INITIALIZATION, error.message),
    );
    this.player.addListener('authentication_error', error =>
      this.handlePlayerErrors(ERROR_TYPE.AUTHENTICATION, error.message),
    );
    this.player.addListener('account_error', error =>
      this.handlePlayerErrors(ERROR_TYPE.ACCOUNT, error.message),
    );
    this.player.addListener('playback_error', error =>
      this.handlePlayerErrors(ERROR_TYPE.PLAYBACK, error.message),
    );
    this.player.addListener('autoplay_failed', async () => {
      // eslint-disable-next-line no-console
      console.log('Autoplay is not allowed by the browser autoplay rules');
    });

    this.player.connect();

    if (getPlayer) {
      getPlayer(this.player);
    }
  };

  private get isExternalPlayer(): boolean {
    const { currentDeviceId, deviceId, status } = this.state;

    return (currentDeviceId && currentDeviceId !== deviceId) || status === STATUS.UNSUPPORTED;
  }

  private setExternalDevice = (id: string) => {
    this.updateState({ currentDeviceId: id, isPlaying: true });
  };

  private setVolume = async (volume: number) => {
    /* istanbul ignore else */
    if (this.isExternalPlayer) {
      await setVolume(this.token, Math.round(volume * 100));
      await this.syncDevice();
    } else if (this.player) {
      await this.player.setVolume(volume);
    }

    this.updateState({ volume });
  };

  private syncDevice = async () => {
    if (!this.isMounted) {
      return;
    }

    const { deviceId } = this.state;

    try {
      const playerState = await getPlaybackState(this.token);
      let track = this.emptyTrack;

      if (!playerState) {
        throw new Error('No player');
      }

      /* istanbul ignore else */
      if (playerState.item) {
        track = {
          artists: 'artists' in playerState.item ? playerState.item.artists : [],
          durationMs: playerState.item.duration_ms,
          id: playerState.item.id,
          image: 'album' in playerState.item ? getAlbumImage(playerState.item.album) : '',
          name: playerState.item.name,
          uri: playerState.item.uri,
        };
      }

      this.updateState({
        error: '',
        errorType: null,
        isActive: true,
        isPlaying: playerState.is_playing,
        nextTracks: [],
        previousTracks: [],
        progressMs: playerState.item ? playerState.progress_ms ?? 0 : 0,
        status: STATUS.READY,
        track,
        volume: parseVolume(playerState.device.volume_percent),
      });
    } catch (error: any) {
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
        errorType: ERROR_TYPE.PLAYER,
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
    const { currentDeviceId } = this.state;
    const { offset, uris } = this.props;
    const playOptions = this.getPlayOptions(getURIs(uris));

    if (typeof offset === 'number') {
      await play(this.token, { deviceId: currentDeviceId, offset, ...playOptions });
    }
  };

  private togglePlay = async (force = false) => {
    const { currentDeviceId, isPlaying, needsUpdate } = this.state;
    const { offset, uris } = this.props;
    const shouldInitialize = force || needsUpdate;
    const playOptions = this.getPlayOptions(getURIs(uris));

    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        if (!isPlaying) {
          await play(this.token, {
            deviceId: currentDeviceId,
            offset,
            ...(shouldInitialize ? playOptions : undefined),
          });
        } else {
          await pause(this.token);

          this.updateState({ isPlaying: false });
        }

        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        await this.player.activateElement();

        const playerState = await this.player.getCurrentState();
        const shouldPlay = !playerState && !!(playOptions.context_uri ?? playOptions.uris);

        if (shouldPlay || shouldInitialize) {
          await play(this.token, {
            deviceId: currentDeviceId,
            offset,
            ...(shouldInitialize ? playOptions : undefined),
          });
          await this.player.togglePlay();
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
    if (!this.isMounted) {
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
        const state = await this.player.getCurrentState();

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

  private updateState: typeof this.setState = state => {
    if (!this.isMounted) {
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
      isActive,
      isMagnified,
      isPlaying,
      isUnsupported,
      nextTracks,
      playerPosition,
      position,
      progressMs,
      status,
      track,
      volume,
    } = this.state;
    const {
      components,
      hideAttribution = false,
      hideCoverArt = false,
      inlineVolume = true,
      layout = 'responsive',
      showSaveIcon,
      updateSavedStatus,
    } = this.props;
    const isReady = ([STATUS.READY, STATUS.UNSUPPORTED] as Status[]).includes(status);

    const output: Record<string, ReactNode> = {
      main: <Loader styles={this.styles} />,
    };

    if (isReady) {
      /* istanbul ignore else */
      if (!output.info) {
        output.info = (
          <Info
            hideAttribution={hideAttribution}
            hideCoverArt={hideCoverArt}
            isActive={isActive}
            layout={layout}
            locale={this.locale}
            onFavoriteStatusChange={this.handleFavoriteStatusChange}
            showSaveIcon={showSaveIcon!}
            styles={this.styles}
            token={this.token}
            track={track}
            updateSavedStatus={updateSavedStatus}
          />
        );
      }

      output.devices = (
        <Devices
          currentDeviceId={currentDeviceId}
          deviceId={deviceId}
          devices={devices}
          layout={layout}
          locale={this.locale}
          onClickDevice={this.handleClickDevice}
          open={isUnsupported && !deviceId}
          playerPosition={playerPosition}
          styles={this.styles}
        />
      );

      output.volume = currentDeviceId ? (
        <Volume
          inlineVolume={inlineVolume}
          layout={layout}
          locale={this.locale}
          playerPosition={playerPosition}
          setVolume={this.setVolume}
          styles={this.styles}
          volume={volume}
        />
      ) : null;

      if (this.renderInlineActions) {
        output.actions = (
          <Actions layout={layout} styles={this.styles}>
            {output.devices}
            {output.volume}
          </Actions>
        );
      }

      output.controls = (
        <Controls
          components={components}
          devices={this.renderInlineActions ? null : output.devices}
          durationMs={track.durationMs}
          isActive={isActive}
          isExternalDevice={this.isExternalPlayer}
          isMagnified={isMagnified}
          isPlaying={isPlaying}
          layout={layout}
          locale={this.locale}
          nextTracks={nextTracks}
          onChangeRange={this.handleChangeRange}
          onClickNext={this.handleClickNext}
          onClickPrevious={this.handleClickPrevious}
          onClickTogglePlay={this.handleClickTogglePlay}
          onToggleMagnify={this.handleToggleMagnify}
          position={position}
          progressMs={progressMs}
          styles={this.styles}
          volume={this.renderInlineActions ? null : output.volume}
        />
      );

      output.main = (
        <Wrapper layout={layout} styles={this.styles}>
          {output.info}
          {output.controls}
          {output.actions}
        </Wrapper>
      );
    } else if (output.info) {
      output.main = output.info;
    }

    if (status === STATUS.ERROR) {
      output.main = <ErrorMessage styles={this.styles}>{error}</ErrorMessage>;
    }

    return (
      <Player ref={this.ref} data-ready={isReady} styles={this.styles}>
        {output.main}
      </Player>
    );
  }
}

export * from './types';
export type SpotifyPlayer = Spotify.Player;

export { ERROR_TYPE, STATUS, TYPE } from './constants';
export * as spotifyApi from './modules/spotify';

export default SpotifyWebPlayer;
