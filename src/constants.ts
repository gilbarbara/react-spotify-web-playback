export const ERROR_TYPE = {
  ACCOUNT: 'account',
  AUTHENTICATION: 'authentication',
  INITIALIZATION: 'initialization',
  PLAYBACK: 'playback',
  PLAYER: 'player',
} as const;

export const SPOTIFY_CONTENT_TYPE = {
  ALBUM: 'album',
  ARTIST: 'artist',
  PLAYLIST: 'playlist',
  SHOW: 'show',
  TRACK: 'track',
};

export const STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  UNSUPPORTED: 'UNSUPPORTED',
} as const;

export const TRANSPARENT_COLOR = 'rgba(0, 0, 0, 0)';

export const TYPE = {
  DEVICE: 'device_update',
  FAVORITE: 'favorite_update',
  PLAYER: 'player_update',
  PRELOAD: 'preload_update',
  PROGRESS: 'progress_update',
  STATUS: 'status_update',
  TRACK: 'track_update',
} as const;
