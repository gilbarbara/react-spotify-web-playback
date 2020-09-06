type SpotifyPlayerMethod<T = void> = () => Promise<T>;

export type SpotifyPlayerCallback = (token: string) => void;

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyPlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

export interface SpotifyPlayerStatus {
  actions: {
    disallows: {
      resuming: boolean;
      skipping_prev: boolean;
    };
  };
  context: null;
  currently_playing_type: string;
  device: {
    id: string;
    is_active: boolean;
    is_private_session: false;
    is_restricted: false;
    name: string;
    type: string;
    volume_percent: number;
  };
  is_playing: boolean;
  item: {
    album: {
      album_type: string;
      artists: SpotifyArtist[];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: SpotifyImage[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: false;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: false;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  progress_ms: number;
  repeat_state: string;
  shuffle_state: false;
  timestamp: number;
}

export interface SpotifyPlayerTrack {
  artists: string;
  durationMs: number;
  id: string;
  name: string;
  image: string;
  uri: string;
}

export type WebPlaybackStatuses = 'ready' | 'not_ready';
export type WebPlaybackStates = 'player_state_changed';
export type WebPlaybackErrors =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

export interface WebPlaybackError {
  message: WebPlaybackErrors;
}

export interface WebPlaybackPlayer {
  _options: {
    getOAuthToken: SpotifyPlayerCallback;
    name: string;
    id: string;
    volume: number;
  };
  addListener: {
    (event: WebPlaybackErrors, callback: (d: WebPlaybackError) => void): boolean;
    (event: WebPlaybackStates, callback: (d: WebPlaybackState | null) => void): boolean;
    (event: WebPlaybackStatuses, callback: (d: WebPlaybackReady) => void): boolean;
  };
  connect: SpotifyPlayerMethod;
  disconnect: () => void;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  getVolume: SpotifyPlayerMethod<number>;
  nextTrack: SpotifyPlayerMethod;
  pause: SpotifyPlayerMethod;
  previousTrack: SpotifyPlayerMethod;
  removeListener: (
    event: WebPlaybackErrors | WebPlaybackStates | WebPlaybackStatuses,
    callback?: () => void,
  ) => boolean;
  resume: SpotifyPlayerMethod;
  seek: (positionMS: number) => Promise<void>;
  setName: (n: string) => Promise<void>;
  setVolume: (n: number) => Promise<void>;
  togglePlay: SpotifyPlayerMethod;
}

export interface WebPlaybackReady {
  device_id: string;
}

export interface WebPlaybackState {
  bitrate: number;
  context: {
    metadata: Record<string, unknown>;
    uri: null;
  };
  disallows: {
    resuming: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  restrictions: {
    disallow_resuming_reasons: [];
    disallow_skipping_prev_reasons: [];
  };
  shuffle: boolean;
  timestamp: number;
  track_window: {
    current_track: WebPlaybackTrack;
    next_tracks: WebPlaybackTrack[];
    previous_tracks: WebPlaybackTrack[];
  };
}

export interface WebPlaybackAlbum {
  images: WebPlaybackImage[];
  name: string;
  uri: string;
}

export interface WebPlaybackArtist {
  name: string;
  uri: string;
}

export interface WebPlaybackImage {
  height: number;
  url: string;
  width: number;
}

export interface WebPlaybackTrack {
  album: WebPlaybackAlbum;
  artists: WebPlaybackArtist[];
  duration_ms: number;
  id: string;
  is_playable: boolean;
  linked_from: {
    uri: null | string;
    id: null | string;
  };
  linked_from_uri: null | string;
  media_type: string;
  name: string;
  type: string;
  uri: string;
}
