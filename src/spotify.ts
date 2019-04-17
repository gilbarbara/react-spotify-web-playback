interface PlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

export async function play(
  { context_uri, deviceId, offset = 0, uris }: PlayOptions,
  token: string,
) {
  let body;

  if (context_uri) {
    const isArtist = context_uri.indexOf('artist') >= 0;
    let position;

    if (!isArtist) {
      position = { position: offset };
    }

    body = JSON.stringify({ context_uri, offset: position });
  } else if (Array.isArray(uris) && uris.length) {
    body = JSON.stringify({ uris, offset: { position: offset } });
  }

  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function pause(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/pause`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function previous(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/previous`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function next(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/next`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function getPlayerStatus(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function seek(position: number, token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function setVolume(volume: number, token: string) {
  return fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
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

export interface PlayerTrack {
  artists: string;
  durationMs: number;
  id: string;
  name: string;
  image: string;
  uri: string;
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

export interface SpotifyPlayerStatus {
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
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
      skipping_prev: boolean;
    };
  };
  is_playing: boolean;
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
