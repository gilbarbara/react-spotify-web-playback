export async function play(deviceId: string, token: string, tracks: string[], offset: number = 0) {
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    body: JSON.stringify({ uris: tracks, offset: { position: offset } }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function getDevices(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function setDevice(deviceId: string, token: string) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: true }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export type WebPlaybackStatusEvents = 'ready' | 'not_ready';
export type WebPlaybackStateEvent = 'player_state_changed';
export type WebPlaybackErrorsEvents =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

export interface WebPlaybackError {
  message: WebPlaybackErrorsEvents;
}

export interface WebPlaybackPlayer {
  _options: {
    getOAuthToken: () => () => void;
    name: string;
    id: string;
    volume: number;
  };
  addListener: {
    (event: WebPlaybackErrorsEvents, callback: (d: WebPlaybackError) => void): boolean;
    (event: WebPlaybackStateEvent, callback: (d: WebPlaybackState | null) => void): boolean;
    (event: WebPlaybackStatusEvents, callback: (d: WebPlaybackReady) => void): boolean;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  removeListener: (
    event: WebPlaybackErrorsEvents | WebPlaybackStateEvent | WebPlaybackStatusEvents,
    callback?: () => void,
  ) => boolean;
  resume: () => Promise<void>;
  seek: (positionMS: number) => Promise<void>;
  setName: (n: string) => Promise<void>;
  setVolume: (n: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

export interface WebPlaybackReady {
  device_id: string;
}

export interface WebPlaybackState {
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
    current_track: WebPlaybackTrack;
    next_tracks: WebPlaybackTrack[];
    previous_tracks: WebPlaybackTrack[];
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

export interface WebPlaybackAlbum {
  uri: string;
  name: string;
  images: WebPlaybackImage[];
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
  artists: WebPlaybackArtist[];
  album: WebPlaybackAlbum;
  is_playable: boolean;
}
