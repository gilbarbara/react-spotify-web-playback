/* eslint-disable camelcase */
import { SpotifyPlayOptions } from './types';

export async function checkTracksStatus(token: string, tracks: string | string[]) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
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

export async function getPlaybackState(token: string) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => {
    if (d.status === 204) {
      return null;
    }

    return d.json();
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

export async function play(
  token: string,
  { context_uri, deviceId, offset = 0, uris }: SpotifyPlayOptions,
) {
  let body;

  if (context_uri) {
    const isArtist = context_uri.indexOf('artist') >= 0;
    let position;

    /* istanbul ignore else */
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

export async function removeTracks(token: string, tracks: string | string[]) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify(ids),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
}

export async function saveTracks(token: string, tracks: string | string[]) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];

  return fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function seek(token: string, position: number) {
  return fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function setDevice(token: string, deviceId: string, shouldPlay?: boolean | undefined) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: shouldPlay }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function setVolume(token: string, volume: number) {
  return fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}
