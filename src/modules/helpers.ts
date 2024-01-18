/* eslint-disable camelcase */
import { RepeatState, SpotifyTrack } from '~/types';

export function convertTrack(track: Spotify.Track): SpotifyTrack {
  const { album, artists, duration_ms, id, name, uri } = track;

  return {
    artists,
    durationMs: duration_ms,
    id: id ?? '',
    image: getAlbumImage(album),
    name,
    uri,
  };
}

export function getAlbumImage(album: Spotify.Album) {
  const maxWidth = Math.max(...album.images.map(d => d.width || 0));

  return album.images.find(d => d.width === maxWidth)?.url || '';
}

export function getRepeatState(mode: number): RepeatState {
  switch (mode) {
    case 1:
      return 'context';
    case 2:
      return 'track';
    case 0:
    default:
      return 'off';
  }
}

export function getURIs(uris: string | string[]): string[] {
  if (!uris) {
    return [];
  }

  return Array.isArray(uris) ? uris : [uris];
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById('spotify-player');

    if (!scriptTag) {
      const script = document.createElement('script');

      script.id = 'spotify-player';
      script.type = 'text/javascript';
      script.async = false;
      script.defer = true;
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

export function millisecondsToTime(input: number) {
  const seconds = Math.floor((input / 1000) % 60);
  const minutes = Math.floor((input / (1000 * 60)) % 60);
  const hours = Math.floor((input / (1000 * 60 * 60)) % 24);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(
      `${hours}`.padStart(2, '0'),
      `${minutes}`.padStart(2, '0'),
      `${seconds}`.padStart(2, '0'),
    );
  } else {
    parts.push(`${minutes}`, `${seconds}`.padStart(2, '0'));
  }

  return parts.join(':');
}

export function parseVolume(value?: unknown): number {
  if (!isNumber(value)) {
    return 1;
  }

  if (value > 1) {
    return value / 100;
  }

  return value;
}

/**
 * Round decimal numbers
 */
export function round(number: number, digits = 2) {
  const factor = 10 ** digits;

  return Math.round(number * factor) / factor;
}

export function validateURI(input: string): boolean {
  const validTypes = ['album', 'artist', 'playlist', 'show', 'track'];

  /* istanbul ignore else */
  if (input && input.indexOf(':') > -1) {
    const [key, type, id] = input.split(':');

    /* istanbul ignore else */
    if (key === 'spotify' && validTypes.indexOf(type) >= 0 && id.length === 22) {
      return true;
    }
  }

  return false;
}
