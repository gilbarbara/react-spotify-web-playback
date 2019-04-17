import React from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import {
  PlayerTrack,
  SpotifyPlayerStatus,
  WebPlaybackAlbum,
  WebPlaybackError,
  WebPlaybackImage,
  WebPlaybackPlayer,
  WebPlaybackReady,
  WebPlaybackState,
  WebPlaybackTrack,
  getPlayerStatus,
  next,
  pause,
  play,
  previous,
  seek,
  setVolume,
} from './spotify';
import { isEqualArray, loadScript, STATUS, TYPE } from './utils';
import { RangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';

import Controls from './Controls';
import Devices from './Devices';
import Volume from './Volume';

export interface Callback extends State {
  type: string;
}

export interface Props {
  autoPlay?: boolean;
  callback?: (state: Callback) => any;
  list?: string;
  name?: string;
  offset?: number;
  persistDeviceSelection?: boolean;
  token: string;
  tracks?: string | string[];
}

export interface State {
  currentDeviceId: string;
  deviceId: string;
  error: string;
  errorType: string;
  isActive: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isUnsupported: boolean;
  nextTracks: WebPlaybackTrack[];
  position: number;
  previousTracks: WebPlaybackTrack[];
  progressMs?: number;
  status: string;
  track: PlayerTrack;
  volume: number;
}

class SpotifyWebPlayer extends React.Component<Props, State> {
  private static defaultProps = {
    callback: () => undefined,
    name: 'Spotify Web Player',
  };

  // tslint:disable-next-line:variable-name
  private _isMounted = false;
  private player?: WebPlaybackPlayer;
  private playerProgressInterval?: number;
  private playerSyncInterval?: number;
  private seekUpdateInterval = 100;

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
      track: {
        artists: '',
        durationMs: 0,
        id: '',
        image: '',
        name: '',
        uri: '',
      },
      volume: 1,
    };
  }

  public async componentDidMount() {
    this._isMounted = true;
    this.setState({ status: STATUS.INITIALIZING });

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = this.initializePlayer;

    await loadScript({
      defer: true,
      id: 'spotify-player',
      source: 'https://sdk.scdn.co/spotify-player.js',
    });
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { currentDeviceId, isPlaying, status, track } = this.state;
    const { autoPlay, callback, list, offset, tracks, token } = this.props;
    const isReady = prevState.status !== STATUS.READY && status === STATUS.READY;
    const changedSource =
      prevProps.list !== list || (Array.isArray(tracks) && !isEqualArray(prevProps.tracks, tracks));
    const canPlay = currentDeviceId && !!(list || this.tracks);
    const shouldPlay = (changedSource && isPlaying) || (isReady && autoPlay);

    if (canPlay && shouldPlay) {
      play({ context_uri: list, deviceId: currentDeviceId, uris: this.tracks, offset }, token);
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

    if (prevState.currentDeviceId !== currentDeviceId) {
      this.handleDeviceChange();

      if (!isReady) {
        callback!({
          ...this.state,
          type: TYPE.DEVICE,
        });
      }
    }

    if (prevState.isPlaying !== isPlaying) {
      this.handlePlaybackStatus();
      this.handleDeviceChange();

      callback!({
        ...this.state,
        type: TYPE.PLAYER,
      });
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;

    if (this.player) {
      this.player.disconnect();
    }

    clearInterval(this.playerSyncInterval);
    clearInterval(this.playerProgressInterval);
  }

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

  private updateSeekBar = async () => {
    const { isPlaying, progressMs, track } = this.state;

    if (isPlaying) {
      if (this.isExternalPlayer) {
        const position = progressMs! / track.durationMs;

        this.setState({
          position: Number((position * 100).toFixed(1)),
          progressMs: progressMs! + this.seekUpdateInterval,
        });
      } else if (this.player) {
        const state = (await this.player.getCurrentState()) as WebPlaybackState;

        if (state) {
          const position = state.position / state.track_window.current_track.duration_ms;

          this.setState({ position: Number((position * 100).toFixed(1)) });
        }
      }
    }
  };

  private setVolume = (volume: number) => {
    const { token } = this.props;

    if (this.isExternalPlayer) {
      setVolume(Math.round(volume * 100), token);
    } else if (this.player) {
      this.player.setVolume(volume);
    }

    this.setState({ volume });
  };

  private togglePlay = async (init?: boolean) => {
    const { currentDeviceId, isPlaying } = this.state;
    const { list, offset, token } = this.props;

    if (this.isExternalPlayer) {
      if (!isPlaying) {
        this.setState({ isPlaying: true });

        return play(
          {
            context_uri: list,
            deviceId: currentDeviceId,
            offset,
            uris: init ? this.tracks : undefined,
          },
          token,
        );
      } else {
        this.setState({ isPlaying: false });
        return pause(token);
      }
    } else if (this.player) {
      const playerState = await this.player.getCurrentState();

      if (!playerState && this.tracks.length) {
        return play(
          { context_uri: list, deviceId: currentDeviceId, uris: this.tracks, offset },
          token,
        );
      } else {
        this.player.togglePlay();
      }
    }
  };

  private syncDevice = async () => {
    if (!this._isMounted) {
      return;
    }

    const { token } = this.props;

    try {
      const player: SpotifyPlayerStatus = await getPlayerStatus(token);

      this.setState({
        error: '',
        errorType: '',
        isActive: true,
        isPlaying: player.is_playing,
        nextTracks: [],
        previousTracks: [],
        progressMs: player.progress_ms,
        track: {
          artists: player.item.artists.map(d => d.name).join(' / '),
          durationMs: player.item.duration_ms,
          id: player.item.id,
          image: this.getAlbumImage(player.item.album),
          name: player.item.name,
          uri: player.item.uri,
        },
        volume: player.device.volume_percent,
      });
    } catch (error) {
      this.setState({
        error,
        errorType: 'player_status',
        status: STATUS.ERROR,
      });
    }
  };

  private get isExternalPlayer(): boolean {
    const { currentDeviceId, deviceId, status } = this.state;

    return (currentDeviceId && currentDeviceId !== deviceId) || status === STATUS.UNSUPPORTED;
  }

  private get tracks(): string[] {
    const { tracks } = this.props;

    if (!tracks) {
      return [];
    }

    const uris: string[] = Array.isArray(tracks) ? tracks : [tracks];

    return uris.map(
      (d: string): string => (d.indexOf('spotify:track') < 0 ? `spotify:track:${d}` : d),
    );
  }

  private getAlbumImage(album: WebPlaybackAlbum): string {
    const width = Math.min(...album.images.map(d => d.width));
    const thumb: WebPlaybackImage =
      album.images.find(d => d.width === width) || ({} as WebPlaybackImage);

    return thumb.url;
  }

  private handlePlaybackStatus() {
    const { isPlaying } = this.state;

    if (isPlaying) {
      if (!this.playerProgressInterval) {
        this.playerProgressInterval = window.setInterval(
          this.updateSeekBar,
          this.seekUpdateInterval,
        );
      }
    } else {
      if (this.playerProgressInterval) {
        clearInterval(this.playerProgressInterval);
        this.playerProgressInterval = undefined;
      }
    }
  }

  private handleDeviceChange() {
    const { isPlaying } = this.state;

    if (this.isExternalPlayer && isPlaying && !this.playerSyncInterval) {
      this.playerSyncInterval = window.setInterval(this.syncDevice, 10 * 1000);
    }

    if ((!isPlaying || !this.isExternalPlayer) && this.playerSyncInterval) {
      clearInterval(this.playerSyncInterval);
      this.playerSyncInterval = undefined;
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

    this.setState({
      error: message,
      errorType: type,
      isUnsupported: isInitializationError,
      status: nextStatus,
    });
  };

  private handlePlayerStateChanges = async (state: WebPlaybackState | null) => {
    if (state) {
      const isPlaying = !state.paused;
      const { album, artists, duration_ms, id, name, uri } = state.track_window.current_track;
      const volume = await this.player!.getVolume();
      const track = {
        artists: artists.map(d => d.name).join(' / '),
        durationMs: duration_ms,
        id,
        image: this.getAlbumImage(album),
        name,
        uri,
      };

      this.setState({
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
      this.setState({
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
  };

  private handlePlayerStatus = ({ device_id }: WebPlaybackReady) => {
    this.setState({
      currentDeviceId: device_id,
      deviceId: device_id,
      status: device_id ? STATUS.READY : STATUS.IDLE,
    });
  };

  private handleChangeRange = async ({ x }: RangeSliderPosition) => {
    const { track } = this.state;
    const { token } = this.props;
    const percentage = x / 100;

    if (this.isExternalPlayer) {
      try {
        await seek(Math.round(track.durationMs * percentage), token);

        this.setState({
          position: x,
          progressMs: Math.round(track.durationMs * percentage),
        });
      } catch (error) {
        // nothing here
      }
    } else if (this.player) {
      const state = (await this.player.getCurrentState()) as WebPlaybackState;

      if (state) {
        this.player.seek(Math.round(state.track_window.current_track.duration_ms * percentage));
      } else {
        this.setState({ position: 0 });
      }
    }
  };

  private handleClickTogglePlay = async () => {
    this.togglePlay();
  };

  private handleClickPrevious = async () => {
    if (this.isExternalPlayer) {
      const { token } = this.props;

      await previous(token);
      setTimeout(() => {
        this.syncDevice();
      }, 300);
    } else if (this.player) {
      await this.player.previousTrack();
    }
  };

  private handleClickNext = async () => {
    if (this.isExternalPlayer) {
      const { token } = this.props;

      await next(token);
      setTimeout(() => {
        this.syncDevice();
      }, 300);
    } else if (this.player) {
      await this.player.nextTrack();
    }
  };

  private handleClickDevice = async (deviceId: string) => {
    const { isUnsupported } = this.state;

    this.setState({ currentDeviceId: deviceId });

    if (isUnsupported) {
      await this.togglePlay(true);
      await this.syncDevice();
    }
  };

  private handleToggleMagnify = () => {
    const { isMagnified } = this.state;

    this.setState({ isMagnified: !isMagnified });
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
    const { name, token } = this.props;
    const isReady = [STATUS.READY, STATUS.UNSUPPORTED].indexOf(status) >= 0;
    const isPlaybackError = errorType === 'playback_error';

    let output = (
      <div className="rswp__loader">
        <div />
      </div>
    );

    let info;

    if (isPlaybackError) {
      info = <p>{error}</p>;
    }

    if (isReady) {
      if (!info) {
        info = (
          <React.Fragment>
            <img src={track.image} alt={track.name} />
            <div className="rswp__title">
              <p>{track.name}</p>
              <p>{track.artists}</p>
            </div>
          </React.Fragment>
        );
      }

      output = (
        <React.Fragment>
          <div className="rswp__info">{info}</div>
          <Controls
            isExternalDevice={this.isExternalPlayer}
            isPlaying={isPlaying}
            onClickNext={this.handleClickNext}
            onClickPrevious={this.handleClickPrevious}
            onClickTogglePlay={this.handleClickTogglePlay}
            nextTracks={nextTracks}
            previousTracks={previousTracks}
          />
          <div className="rswp__actions">
            {currentDeviceId && <Volume volume={volume} setVolume={this.setVolume} />}
            <Devices
              deviceId={currentDeviceId}
              open={isUnsupported && !deviceId}
              onClickDevice={this.handleClickDevice}
              token={token}
            />
          </div>
        </React.Fragment>
      );
    }

    if (status === STATUS.ERROR) {
      output = (
        <p className="rswp__error">
          {name}: {error}
        </p>
      );
    }

    const classes = ['rswp'];

    if (isActive) {
      classes.push('rswp--active');
    }

    return (
      <div className={classes.join(' ')}>
        {isReady && (
          <div
            className="rswp__track"
            onMouseEnter={this.handleToggleMagnify}
            onMouseLeave={this.handleToggleMagnify}
          >
            <RangeSlider
              axis="x"
              onChange={this.handleChangeRange}
              styles={{
                options: {
                  handleBorder: '1px solid #000',
                  handleBorderRadius: 10,
                  handleColor: '#000',
                  handleSize: isMagnified ? 14 : 10,
                  height: isMagnified ? 8 : 4,
                  padding: 0,
                  rangeColor: '#666',
                  trackBorderRadius: 0,
                  trackColor: '#ccc',
                },
              }}
              x={position}
              xMin={0}
              xMax={100}
              xStep={0.1}
            />
          </div>
        )}
        <div className="rswp__container">{output}</div>
      </div>
    );
  }
}

export { STATUS, TYPE };

export default SpotifyWebPlayer;
