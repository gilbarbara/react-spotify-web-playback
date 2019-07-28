export interface IPlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

export interface IPlayerTrack {
  artists: string;
  durationMs: number;
  id: string;
  name: string;
  image: string;
  uri: string;
}

export interface ISpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface ISpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ISpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface ISpotifyPlayerStatus {
  device: {
    id: string;
    is_active: boolean;
    is_private_session: false;
    is_restricted: false;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: false;
  repeat_state: string;
  timestamp: number;
  context: null;
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: ISpotifyArtist[];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: ISpotifyImage[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: ISpotifyArtist[];
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
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
      skipping_prev: boolean;
    };
  };
  is_playing: boolean;
}

export type WebPlaybackStatuses = 'ready' | 'not_ready';
export type WebPlaybackStates = 'player_state_changed';
export type WebPlaybackErrors =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

export interface IWebPlaybackError {
  message: WebPlaybackErrors;
}

export interface IWebPlaybackPlayer {
  _options: {
    getOAuthToken: () => () => void;
    name: string;
    id: string;
    volume: number;
  };
  addListener: {
    (event: WebPlaybackErrors, callback: (d: IWebPlaybackError) => void): boolean;
    (event: WebPlaybackStates, callback: (d: IWebPlaybackState | null) => void): boolean;
    (event: WebPlaybackStatuses, callback: (d: IWebPlaybackReady) => void): boolean;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
  getCurrentState: () => Promise<IWebPlaybackState | null>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  removeListener: (
    event: WebPlaybackErrors | WebPlaybackStates | WebPlaybackStatuses,
    callback?: () => void,
  ) => boolean;
  resume: () => Promise<void>;
  seek: (positionMS: number) => Promise<void>;
  setName: (n: string) => Promise<void>;
  setVolume: (n: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

export interface IWebPlaybackReady {
  device_id: string;
}

export interface IWebPlaybackState {
  context: {
    uri: null;
    metadata: object;
  };
  bitrate: number;
  position: number;
  duration: number;
  paused: boolean;
  shuffle: boolean;
  repeat_mode: number;
  track_window: {
    current_track: IWebPlaybackTrack;
    next_tracks: IWebPlaybackTrack[];
    previous_tracks: IWebPlaybackTrack[];
  };
  timestamp: number;
  restrictions: {
    disallow_resuming_reasons: [];
    disallow_skipping_prev_reasons: [];
  };
  disallows: {
    resuming: boolean;
    skipping_prev: boolean;
  };
}

export interface IWebPlaybackAlbum {
  uri: string;
  name: string;
  images: IWebPlaybackImage[];
}

export interface IWebPlaybackArtist {
  name: string;
  uri: string;
}

export interface IWebPlaybackImage {
  height: number;
  url: string;
  width: number;
}

export interface IWebPlaybackTrack {
  id: string;
  uri: string;
  type: string;
  linked_from_uri: null | string;
  linked_from: {
    uri: null | string;
    id: null | string;
  };
  media_type: string;
  name: string;
  duration_ms: number;
  artists: IWebPlaybackArtist[];
  album: IWebPlaybackAlbum;
  is_playable: boolean;
}
