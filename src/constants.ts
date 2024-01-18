export const ERROR_TYPE = {
  ACCOUNT: 'account',
  AUTHENTICATION: 'authentication',
  INITIALIZATION: 'initialization',
  PLAYBACK: 'playback',
  PLAYER: 'player',
} as const;

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
  PROGRESS: 'progress_update',
  STATUS: 'status_update',
  TRACK: 'track_update',
} as const;
