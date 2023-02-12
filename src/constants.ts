export const STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  UNSUPPORTED: 'UNSUPPORTED',
} as const;

export const TYPE = {
  DEVICE: 'device_update',
  FAVORITE: 'favorite_update',
  PLAYER: 'player_update',
  PROGRESS: 'progress_update',
  STATUS: 'status_update',
  TRACK: 'track_update',
} as const;
