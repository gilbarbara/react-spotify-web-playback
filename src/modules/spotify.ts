/* eslint-disable camelcase */
import { parseIds } from '~/modules/helpers';

import { IDs, RepeatState, SpotifyPlayOptions } from '~/types';

export async function checkTracksStatus(token: string, tracks: IDs): Promise<boolean[]> {
  return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${parseIds(tracks)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getAlbumTracks(
  token: string,
  id: string,
): Promise<SpotifyApi.AlbumTracksResponse> {
  return fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getArtistTopTracks(
  token: string,
  id: string,
): Promise<SpotifyApi.ArtistsTopTracksResponse> {
  return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getDevices(token: string): Promise<SpotifyApi.UserDevicesResponse> {
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getPlaybackState(
  token: string,
): Promise<SpotifyApi.CurrentlyPlayingObject | null> {
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

export async function getPlaylistTracks(
  token: string,
  id: string,
): Promise<SpotifyApi.PlaylistTrackResponse> {
  return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getQueue(token: string): Promise<SpotifyApi.UsersQueueResponse> {
  return fetch(`https://api.spotify.com/v1/me/player/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getShow(token: string, id: string): Promise<SpotifyApi.ShowObjectFull> {
  return fetch(`https://api.spotify.com/v1/shows/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getShowEpisodes(
  token: string,
  id: string,
  offset = 0,
): Promise<SpotifyApi.ShowEpisodesResponse> {
  return fetch(`https://api.spotify.com/v1/shows/${id}/episodes?offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function getTrack(token: string, id: string): Promise<SpotifyApi.TrackObjectFull> {
  return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then(d => d.json());
}

export async function next(token: string, deviceId?: string): Promise<void> {
  let query = '';

  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/next${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function pause(token: string, deviceId?: string): Promise<void> {
  let query = '';

  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/pause${query}`, {
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
): Promise<void> {
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

  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function previous(token: string, deviceId?: string): Promise<void> {
  let query = '';

  if (deviceId) {
    query += `?device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/previous${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function removeTracks(token: string, tracks: IDs): Promise<void> {
  await fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids: parseIds(tracks) }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
}

export async function repeat(token: string, state: RepeatState, deviceId?: string): Promise<void> {
  let query = `?state=${state}`;

  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/repeat${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function saveTracks(token: string, tracks: IDs): Promise<void> {
  await fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids: parseIds(tracks) }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function seek(token: string, position: number, deviceId?: string): Promise<void> {
  let query = `?position_ms=${position}`;

  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/seek${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function setDevice(
  token: string,
  deviceId: string,
  shouldPlay?: boolean,
): Promise<void> {
  await fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: shouldPlay }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function setVolume(token: string, volume: number, deviceId?: string): Promise<void> {
  let query = `?volume_percent=${volume}`;

  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/volume${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

export async function shuffle(token: string, state: boolean, deviceId?: string): Promise<void> {
  let query = `?state=${state}`;

  if (deviceId) {
    query += `&device_id=${deviceId}`;
  }

  await fetch(`https://api.spotify.com/v1/me/player/shuffle${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}
