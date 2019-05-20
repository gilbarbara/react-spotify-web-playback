import React, { PureComponent } from 'react';

import { getPlayerStatus, next, pause, play, previous, seek, setVolume } from './spotify';
import { getMergedStyles } from './styles';
import { getSpotifyURIType, isEqualArray, loadScript, validateURI, STATUS, TYPE } from './utils';

import { PlayOptions, Props, State, StylesOptions } from './types/common';
import {
  SpotifyPlayerStatus,
  WebPlaybackAlbum,
  WebPlaybackError,
  WebPlaybackImage,
  WebPlaybackPlayer,
  WebPlaybackReady,
  WebPlaybackState,
} from './types/spotify';

import Actions from './components/Actions';
import Content from './components/Content';
import Controls from './components/Controls';
import Error from './components/Error';
import Info from './components/Info';
import Loader from './components/Loader';
import Player from './components/Player';
import Slider from './components/Slider';

class SpotifyWebPlayer extends PureComponent<Props, State> {
  private static defaultProps = {
    callback: () => undefined,
    name: 'Spotify Web Player',
    showSaveIcon: false,
    syncExternalDeviceInterval: 5,
  };

  // tslint:disable-next-line:variable-name
  private _isMounted = false;
  private emptyTrack = {
    artists: '',
    durationMs: 0,
    id: '',
    image: '',
    name: '',
    uri: '',
  };
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
      error: '',
      errorType: '',
      isActive: false,
      isMagnified: false,
      isPlaying: false,
      isUnsupported: false,
      nextTracks: [],
      position: 0,
      previousTracks: [],
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: 1,
    };

    this.styles = getMergedStyles(props.styles);
  }

  public async componentDidMount() {
    this._isMounted = true;
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
    const { currentDeviceId, isPlaying, status, track } = this.state;
    const { autoPlay, callback, offset, persistDeviceSelection, token, uris } = this.props;
    const isReady = prevState.status !== STATUS.READY && status === STATUS.READY;
    const changedURIs = Array.isArray(uris) ? !isEqualArray(prevProps.uris, uris) : uris !== uris;

    const canPlay = currentDeviceId && !!(this.playOptions.context_uri || this.playOptions.uris);
    const shouldPlay = (changedURIs && isPlaying) || (isReady && autoPlay);

    if (canPlay && shouldPlay) {
      await play({ deviceId: currentDeviceId, offset, ...this.playOptions }, token);

      /* istanbul ignore else */
      if (!this.state.isPlaying) {
        this.updateState({ isPlaying: true });
      }

      if (this.isExternalPlayer) {
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 600);
      }
    }

    if (prevState.status !== status) {
      callback!({
        ...this.state,
        type: TYPE.STATUS,
      });
    }

    if (prevState.track.id !== track.id && track.id) {
      callback!({
        ...this.state,
        type: TYPE.TRACK,
      });
    }

    if (prevState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      await this.handleDeviceChange();

      if (persistDeviceSelection) {
        sessionStorage.setItem('rswpDeviceId', currentDeviceId);
      }

      if (!isReady) {
        callback!({
          ...this.state,
          type: TYPE.DEVICE,
        });
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
  }

  public componentWillUnmount() {
    this._isMounted = false;

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
        response.uris = ids.filter(d => validateURI(d) && getSpotifyURIType(d) === 'track');
      } else {
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
          this.player.seek(Math.round(state.track_window.current_track.duration_ms * percentage));
        } else {
          this.updateState({ position: 0 });
        }
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  private handleClickTogglePlay = async () => {
    try {
      await this.togglePlay();
    } catch (error) {
      // tslint:disable-next-line:no-console
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
      // tslint:disable-next-line:no-console
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
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  private handleClickDevice = async (deviceId: string) => {
    const { isUnsupported } = this.state;

    this.updateState({ currentDeviceId: deviceId });

    try {
      if (isUnsupported) {
        await this.togglePlay(true);
        await this.syncDevice();
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
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
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  }

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
    } else {
      /* istanbul ignore else */
      if (this.playerProgressInterval) {
        clearInterval(this.playerProgressInterval);
        this.playerProgressInterval = undefined;
      }
    }
  }

  private handlePlayerErrors = (type: string, message: string) => {
    const { status } = this.state;
    const isPlaybackError = type === 'playback_error';
    const isInitializationError = type === 'initialization_error';
    let nextStatus = status;

    if (this.player && !isPlaybackError) {
      this.player.disconnect();
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
          artists: artists.map(d => d.name).join(' / '),
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
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  private handlePlayerStatus = ({ device_id }: WebPlaybackReady) => {
    const { persistDeviceSelection } = this.props;
    let currentDeviceId: string = device_id;

    if (persistDeviceSelection && sessionStorage.getItem('rswpDeviceId')) {
      currentDeviceId = sessionStorage.getItem('rswpDeviceId') as string;
    }

    // TODO: remove this hack after it is fixed in the Web Playback SDK
    const iframe = document.querySelector(
      'iframe[src="https://sdk.scdn.co/embedded/index.html"]',
    ) as HTMLElement;

    if (iframe) {
      iframe.style.display = 'block';
      iframe.style.position = 'absolute';
      iframe.style.top = '-1000px';
      iframe.style.left = '-1000px';
    }

    this.updateState({
      currentDeviceId,
      deviceId: device_id,
      status: device_id ? STATUS.READY : STATUS.IDLE,
    });
  };

  private handleToggleMagnify = () => {
    this.updateState((prevState: State) => {
      return { isMagnified: !prevState.isMagnified };
    });
  };

  private initializePlayer = () => {
    const { name, token } = this.props;

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

  private setAlbumImage(album: WebPlaybackAlbum): string {
    const width = Math.min(...album.images.map(d => d.width));
    const thumb: WebPlaybackImage =
      album.images.find(d => d.width === width) || ({} as WebPlaybackImage);

    return thumb.url;
  }

  private setVolume = (volume: number) => {
    const { token } = this.props;

    /* istanbul ignore else */
    if (this.isExternalPlayer) {
      setVolume(Math.round(volume * 100), token);
    } else if (this.player) {
      this.player.setVolume(volume);
    }

    this.updateState({ volume });
  };

  private syncDevice = async () => {
    if (!this._isMounted) {
      return;
    }

    const { token } = this.props;

    try {
      const player: SpotifyPlayerStatus = await getPlayerStatus(token);
      let track = this.emptyTrack;

      /* istanbul ignore else */
      if (player.item) {
        track = {
          artists: player.item.artists.map(d => d.name).join(' / '),
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
        volume: player.device.volume_percent,
      });
    } catch (error) {
      this.updateState({
        error: error.message,
        errorType: 'player_status',
        status: STATUS.ERROR,
      });
    }
  };

  private togglePlay = async (init?: boolean) => {
    const { currentDeviceId, isPlaying } = this.state;
    const { offset, token } = this.props;

    try {
      /* istanbul ignore else */
      if (this.isExternalPlayer) {
        if (!isPlaying) {
          this.updateState({ isPlaying: true });

          return play(
            {
              deviceId: currentDeviceId,
              offset,
              ...(init ? this.playOptions : undefined),
            },
            token,
          );
        } else {
          this.updateState({ isPlaying: false });
          return pause(token);
        }
      } else if (this.player) {
        const playerState = await this.player.getCurrentState();

        if (!playerState && !!(this.playOptions.context_uri || this.playOptions.uris)) {
          return play(
            { deviceId: currentDeviceId, offset, ...(init ? this.playOptions : undefined) },
            token,
          );
        } else {
          this.player.togglePlay();
        }
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  private updateSeekBar = async () => {
    if (!this._isMounted) {
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
      // tslint:disable-next-line:no-console
      console.error(error);
    }
  };

  private updateState = (state: {}) => {
    if (!this._isMounted) {
      return;
    }

    this.setState(state);
  };

  public render() {
    const {
      currentDeviceId,
      deviceId,
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
    const { name, showSaveIcon, token } = this.props;
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
            showSaveIcon={showSaveIcon!}
            isActive={isActive}
            styles={this.styles}
            token={token}
            track={track}
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
            isDevicesOpen={isUnsupported && !deviceId}
            onClickDevice={this.handleClickDevice}
            setVolume={this.setVolume}
            styles={this.styles}
            token={token}
            volume={volume}
          />
        </React.Fragment>
      );
    }

    if (status === STATUS.ERROR) {
      output = (
        <Error styles={this.styles}>
          {name}: {error}
        </Error>
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
