import React from 'react';
import RangeSlider from '@gilbarbara/react-range-slider';
import { RangeSliderPosition } from '@gilbarbara/react-range-slider/lib/types';
import {
  WebPlaybackAlbum,
  WebPlaybackError,
  WebPlaybackImage,
  WebPlaybackPlayer,
  WebPlaybackReady,
  WebPlaybackState,
  WebPlaybackTrack,
  play,
} from './spotify';
import { loadScript, STATUS } from './utils';

import Volume from './Volume';
import Devices from './Devices';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

export interface Props {
  autoPlay?: boolean;
  name?: string;
  offset?: number;
  token: string;
  uris?: string | string[];
}

export interface State {
  deviceId?: string;
  error: string;
  isActive: boolean;
  isPlaying: boolean;
  nextTracks: WebPlaybackTrack[];
  position: number;
  previousTracks: WebPlaybackTrack[];
  status: string;
  track: {
    artists: string;
    name: string;
    image: string;
  };
  volume: number;
}

export default class SpotifyWebPlayer extends React.PureComponent<Props, State> {
  private static defaultProps = {
    name: 'Spotify Web Player',
  };

  // tslint:disable-next-line:variable-name
  private _isMounted: boolean;
  private player?: WebPlaybackPlayer;
  private interval?: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      deviceId: undefined,
      error: '',
      isActive: false,
      isPlaying: false,
      nextTracks: [],
      position: 0,
      previousTracks: [],
      status: STATUS.IDLE,
      track: {
        artists: '',
        image: '',
        name: '',
      },
      volume: 1,
    };

    this._isMounted = false;
  }

  public componentDidMount() {
    const { name, token } = this.props;

    this.setState({ status: STATUS.INITIALIZING });

    loadScript({
      id: 'spotify-player',
      source: 'https://sdk.scdn.co/spotify-player.js',
    }).then(() => {
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = () => {
        // @ts-ignore
        this.player = new window.Spotify.Player({
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
          name,
        }) as WebPlaybackPlayer;

        this.player.addListener('initialization_error', this.handlePlayerErrors);
        this.player.addListener('authentication_error', this.handlePlayerErrors);
        this.player.addListener('account_error', this.handlePlayerErrors);
        this.player.addListener('playback_error', this.handlePlayerErrors);

        this.player.addListener('player_state_changed', this.handlePlayerStateChanges);
        this.player.addListener('ready', this.handlePlayerStatus);
        this.player.addListener('not_ready', this.handlePlayerStatus);

        this.player.connect();

        // @ts-ignore
        window.player = this.player;
      };
    });
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { deviceId, status } = this.state;
    const { autoPlay, offset, token, uris } = this.props;

    if (prevState.status !== STATUS.READY && status === STATUS.READY && autoPlay && uris) {
      play(deviceId as string, token, this.tracks, offset);
    }
  }

  private updateSeekBar = async () => {
    if (this.player) {
      const state = (await this.player.getCurrentState()) as WebPlaybackState;

      if (state) {
        const width = 200;

        const position = (state.position / state.track_window.current_track.duration_ms) * width;

        this.setState({ position: Number(((position / width) * 100).toFixed(1)) });
      }
    }
  };

  private setVolume = (volume: number) => {
    this.player!.setVolume(volume);
    this.setState({ volume });
  };

  private get tracks(): string[] {
    const { uris } = this.props;

    if (!uris) {
      return [];
    }

    const tracks: string[] = Array.isArray(uris) ? uris : [uris];

    return tracks.map(
      (d: string): string => (d.indexOf('spotify:track') < 0 ? `spotify:track:${d}` : d),
    );
  }

  private getAlbumImage(album: WebPlaybackAlbum): string {
    const width = Math.min(...album.images.map(d => d.width));
    const tbumb: WebPlaybackImage =
      album.images.find(d => d.width === width) || ({} as WebPlaybackImage);

    return tbumb.url;
  }

  private handlePlayerErrors = ({ message }: WebPlaybackError) => {
    if (this.player) {
      this.player.disconnect();
    }

    this.setState({
      error: message,
      status: STATUS.ERROR,
    });
  };

  private handlePlayerStateChanges = async (state: WebPlaybackState | null) => {
    const { isPlaying } = this.state;

    if (state) {
      const isCurrentlyPlaying = !state.paused;
      const { album, artists, name } = state.track_window.current_track;
      const volume = await this.player!.getVolume();

      this.setState({
        isActive: true,
        isPlaying: isCurrentlyPlaying,
        nextTracks: state.track_window.next_tracks,
        previousTracks: state.track_window.previous_tracks,
        track: {
          artists: artists.map(d => d.name).join(' / '),
          image: this.getAlbumImage(album),
          name,
        },
        volume,
      });

      if (isCurrentlyPlaying && !this.interval) {
        this.interval = window.setInterval(this.updateSeekBar, 100);
      }

      if (!isCurrentlyPlaying && this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    } else if (isPlaying) {
      this.setState({
        isActive: false,
        isPlaying: false,
        nextTracks: [],
        position: 0,
        previousTracks: [],
        track: {
          artists: '',
          image: '',
          name: '',
        },
      });
    }
  };

  private handlePlayerStatus = ({ device_id }: WebPlaybackReady) => {
    this.setState({ deviceId: device_id, status: device_id ? STATUS.READY : STATUS.IDLE });
  };

  private handleClickTogglePlay = async () => {
    if (this.player) {
      const { deviceId } = this.state;
      const state = await this.player.getCurrentState();

      if (!state && this.tracks.length) {
        const { token, offset } = this.props;

        play(deviceId as string, token, this.tracks, offset);
      } else {
        this.player.togglePlay();
      }
    }
  };

  private handleClickPrevious = () => {
    if (this.player) {
      this.player.previousTrack();
    }
  };

  private handleClickNext = () => {
    if (this.player) {
      this.player.nextTrack();
    }
  };

  private handleChangeRange = async ({ x }: RangeSliderPosition) => {
    const percentage = x / 100;

    if (this.player) {
      const state = (await this.player.getCurrentState()) as WebPlaybackState;

      if (state) {
        this.player.seek(Math.round(state.track_window.current_track.duration_ms * percentage));
      } else {
        this.setState({ position: 0 });
      }
    }
  };

  public render() {
    const {
      error,
      isActive,
      isPlaying,
      nextTracks,
      position,
      previousTracks,
      status,
      track,
      volume,
    } = this.state;
    const { name, token } = this.props;
    let output = (
      <div className="rswp__loader">
        <div />
      </div>
    );

    if (status === STATUS.READY) {
      output = (
        <React.Fragment>
          <header className="rswp__header">
            <img src={track.image} alt={track.name} />
            <div className="rswp__title">
              <p>{track.name}</p>
              <p>{track.artists}</p>
            </div>
          </header>
          <div className="rswp__controls">
            <div>
              {!!previousTracks.length && (
                <button
                  type="button"
                  onClick={this.handleClickPrevious}
                  aria-label="Previous Track"
                >
                  <Previous />
                </button>
              )}
            </div>
            <div>
              <button
                type="button"
                className="rswp__toggle"
                onClick={this.handleClickTogglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
            <div>
              {!!nextTracks.length && (
                <button type="button" onClick={this.handleClickNext} aria-label="Next Track">
                  <Next />
                </button>
              )}
            </div>
          </div>
          <div className="rswp__actions">
            {isActive && <Volume volume={volume} setVolume={this.setVolume} />}
            <Devices token={token} />
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

    return (
      <div className="rswp">
        {status === STATUS.READY && (
          <div className="rswp__track">
            <RangeSlider
              axis="x"
              onChange={this.handleChangeRange}
              styles={{
                options: {
                  handleBorder: '1px solid #000',
                  handleBorderRadius: 10,
                  handleColor: '#000',
                  height: 4,
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
