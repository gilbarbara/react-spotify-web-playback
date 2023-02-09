import 'jest-extended';

declare global {
  interface Window {
    Spotify: typeof Spotify;
    onSpotifyWebPlaybackSDKReady(): void;
  }
}

declare namespace Spotify {
  interface Album {
    images: Image[];
    name: string;
    uri: string;
  }

  interface Artist {
    name: string;
    uri: string;
    url: string;
  }

  interface Error {
    message: string;
  }

  type ErrorTypes =
    | 'account_error'
    | 'authentication_error'
    | 'initialization_error'
    | 'playback_error';

  interface Image {
    height?: number | null;
    size?: 'UNKNOWN' | 'SMALL' | 'LARGE';
    url: string;
    width?: number | null;
  }

  interface PlaybackContext {
    metadata: any;
    uri: string | null;
  }

  interface PlaybackDisallows {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  }

  interface PlaybackRestrictions {
    disallow_pausing_reasons: string[];
    disallow_peeking_next_reasons: string[];
    disallow_peeking_prev_reasons: string[];
    disallow_resuming_reasons: string[];
    disallow_seeking_reasons: string[];
    disallow_skipping_next_reasons: string[];
    disallow_skipping_prev_reasons: string[];
  }

  interface PlaybackState {
    context: PlaybackContext;
    disallows: PlaybackDisallows;
    duration: number;
    loading: boolean;
    paused: boolean;
    position: number;
    /**
     * 0: NO_REPEAT
     * 1: ONCE_REPEAT
     * 2: FULL_REPEAT
     */
    repeat_mode: 0 | 1 | 2;
    restrictions: PlaybackRestrictions;
    shuffle: boolean;
    track_window: PlaybackTrackWindow;
  }

  interface PlaybackTrackWindow {
    current_track: Track;
    next_tracks: Track[];
    previous_tracks: Track[];
  }

  interface PlayerInit {
    getOAuthToken(callback: (token: string) => void): void;
    name: string;
    volume?: number;
  }

  type ErrorListener = (error: Error) => void;
  type PlaybackInstanceListener = (inst: WebPlaybackInstance) => void;
  type PlaybackStateListener = (s: PlaybackState) => void;
  type EmptyListener = () => void;

  type AddListenerFn = ((
    event: 'ready' | 'not_ready',
    callback: PlaybackInstanceListener,
  ) => void) &
    ((event: 'autoplay_failed', callback: EmptyListener) => void) &
    ((event: 'player_state_changed', callback: PlaybackStateListener) => void) &
    ((event: ErrorTypes, callback: ErrorListener) => void);

  class Player {
    readonly _options: PlayerInit & { id: string };
    constructor(options: PlayerInit);

    activateElement: () => Promise<void>;
    addListener: AddListenerFn;
    connect(): Promise<boolean>;
    disconnect(): void;
    getCurrentState(): Promise<PlaybackState | null>;
    getVolume(): Promise<number>;
    nextTrack(): Promise<void>;
    on: AddListenerFn;
    pause(): Promise<void>;
    previousTrack(): Promise<void>;
    removeListener(
      event: 'ready' | 'not_ready' | 'player_state_changed' | ErrorTypes,
      callback?: ErrorListener | PlaybackInstanceListener | PlaybackStateListener,
    ): void;

    resume(): Promise<void>;
    seek(pos_ms: number): Promise<void>;
    setName(name: string): Promise<void>;
    setVolume(volume: number): Promise<void>;
    togglePlay(): Promise<void>;
  }

  interface Track {
    album: Album;
    artists: Artist[];
    duration_ms: number;
    id: string | null;
    is_playable: boolean;
    linked_from: {
      id: null | string;
      uri: null | string;
    };
    linked_from_uri?: string;
    media_type: 'audio' | 'video';
    name: string;
    track_type: 'audio' | 'video';
    type: 'track' | 'episode' | 'ad';
    uid: string;
    uri: string;
  }

  interface WebPlaybackInstance {
    device_id: string;
  }
}
