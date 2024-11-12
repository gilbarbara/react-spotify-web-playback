import {
  checkTracksStatus,
  getAlbumTracks,
  getArtistTopTracks,
  getDevices,
  getPlaybackState,
  getPlaylistTracks,
  getQueue,
  getShow,
  getShowEpisodes,
  getTrack,
  next,
  pause,
  play,
  previous,
  removeTracks,
  repeat,
  saveTracks,
  seek,
  setDevice,
  setVolume,
  shuffle,
} from '~/modules/spotify';

import {
  playbackState,
  playerAlbumTracks,
  playerArtistTopTracks,
  playerPlaylistTracks,
  playerShow,
  playerTrack,
  queue,
} from '../fixtures/data';

const deviceId = 'df17372ghs982js892js';
const token =
  'BQDoGCFtLXDAVgphhrRSPFHmhG9ZND3BLzSE5WVE-2qoe7_YZzRcVtZ6F7qEhzTih45GyxZLhp9b53A1YAPObAgV0MDvsbcQg-gZzlrIeQwwsWnz3uulVvPMhqssNP5HnE5SX0P0wTOOta1vneq2dL4Hvdko5WqvRivrEKWXCvJTPAFStfa5V5iLdCSglg';
const id = '2ViHeieFA3iPmsBya2NDFl';
const trackUri = `spotify:track:${id}`;

const mockDevices = {
  devices: [
    {
      id: deviceId,
      name: 'Test Player',
      type: 'Computer',
    },
  ],
};

describe('spotify', () => {
  beforeAll(() => {
    fetchMock.mockIf(/.*/, request => {
      const { url } = request;

      if (url.match(/contains\?ids=*/)) {
        return Promise.resolve({
          body: JSON.stringify([false]),
        });
      } else if (url.match(/albums/)) {
        return Promise.resolve({
          body: JSON.stringify(playerAlbumTracks),
        });
      } else if (url.match(/artists/)) {
        return Promise.resolve({
          body: JSON.stringify(playerArtistTopTracks),
        });
      } else if (url.match(/playlist/)) {
        return Promise.resolve({
          body: JSON.stringify(playerPlaylistTracks),
        });
      } else if (url.match(/shows.*0/)) {
        return Promise.resolve({
          body: JSON.stringify(playerShow.episodes),
        });
      } else if (url.match(/shows.*/)) {
        return Promise.resolve({
          body: JSON.stringify(playerShow),
        });
      } else if (url.match(/tracks/)) {
        return Promise.resolve({
          body: JSON.stringify(playerTrack),
        });
      }

      switch (url) {
        case 'https://api.spotify.com/v1/me/player/devices': {
          return Promise.resolve({
            body: JSON.stringify(mockDevices),
          });
        }
        case 'https://api.spotify.com/v1/me/player/queue': {
          return Promise.resolve({
            body: JSON.stringify(queue),
          });
        }
        case 'https://api.spotify.com/v1/me/player': {
          return Promise.resolve({
            body: JSON.stringify(playbackState),
          });
        }
        // No default
      }

      return Promise.resolve({
        body: '',
      });
    });
  });

  it('checkTracksStatus', async () => {
    await expect(checkTracksStatus(token, trackUri)).resolves.toEqual([false]);
  });

  it('getAlbumTracks', async () => {
    await expect(getAlbumTracks(token, id)).resolves.toEqual(playerAlbumTracks);
  });

  it('getArtistTopTracks', async () => {
    await expect(getArtistTopTracks(token, id)).resolves.toEqual(playerArtistTopTracks);
  });

  it('getDevices', async () => {
    await expect(getDevices(token)).resolves.toEqual(mockDevices);
  });

  it('getPlaybackState', async () => {
    await expect(getPlaybackState(token)).resolves.toEqual(playbackState);
  });

  it('getQueue', async () => {
    await expect(getQueue(token)).resolves.toEqual(queue);
  });

  it('getPlaylistTracks', async () => {
    await expect(getPlaylistTracks(token, id)).resolves.toEqual(playerPlaylistTracks);
  });

  it('getShow', async () => {
    await expect(getShow(token, id)).resolves.toEqual(playerShow);
  });

  it('getShowEpisodes', async () => {
    await expect(getShowEpisodes(token, id)).resolves.toEqual(playerShow.episodes);
  });

  it('getTrack', async () => {
    await expect(getTrack(token, id)).resolves.toEqual(playerTrack);
  });

  it('pause', async () => {
    await expect(pause(token)).resolves.toBeUndefined();
  });

  it('play', async () => {
    await expect(play(token, { deviceId })).resolves.toBeUndefined();
  });

  it('previous', async () => {
    await expect(previous(token)).resolves.toBeUndefined();
  });

  it('next', async () => {
    await expect(next(token)).resolves.toBeUndefined();
  });

  it('removeTracks', async () => {
    await expect(removeTracks(token, [trackUri])).resolves.toBeUndefined();
  });

  it('saveTracks', async () => {
    await expect(saveTracks(token, [trackUri])).resolves.toBeUndefined();
  });

  it('repeat', async () => {
    await expect(repeat(token, 'track')).resolves.toBeUndefined();
  });

  it('seek', async () => {
    await expect(seek(token, 1029)).resolves.toBeUndefined();
  });

  it('setDevice', async () => {
    await expect(setDevice(token, deviceId)).resolves.toBeUndefined();
  });

  it('setVolume', async () => {
    await expect(setVolume(token, 1)).resolves.toBeUndefined();
  });

  it('shuffle', async () => {
    await expect(shuffle(token, true)).resolves.toBeUndefined();
  });
});
