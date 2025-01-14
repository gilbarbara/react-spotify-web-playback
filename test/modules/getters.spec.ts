import { TRANSPARENT_COLOR } from '~/constants';
import {
  getBgColor,
  getLocale,
  getMergedStyles,
  getPreloadData,
  getSpotifyLink,
  getSpotifyLinkTitle,
  getSpotifyURIType,
} from '~/modules/getters';

import {
  playerAlbumTracks,
  playerArtistTopTracks,
  playerPlaylistTracks,
  playerShow,
  playerTrack,
} from '../fixtures/data';

describe('getBgColor', () => {
  it('should return the background color', () => {
    expect(getBgColor('#f04')).toBe('#f04');
  });

  it('should return the transparent color', () => {
    expect(getBgColor('transparent')).toBe(TRANSPARENT_COLOR);
  });
});

describe('getLocale', () => {
  it('should return a merged locale', () => {
    expect(getLocale({ currentDevice: 'Selected device ' })).toMatchSnapshot();
  });
});

describe('getMergedStyles', () => {
  it('should return a merged styles', () => {
    expect(getMergedStyles({ bgColor: 'transparent', height: 100 })).toMatchSnapshot();
  });
});

describe('getPreloadData', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should handle albums', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(playerAlbumTracks));
    fetchMock.mockResponseOnce(JSON.stringify(playerTrack));

    await expect(
      getPreloadData('token', 'spotify:album:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toMatchSnapshot();
  });

  it('should handle artist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(playerArtistTopTracks));

    await expect(
      getPreloadData('token', 'spotify:artist:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toMatchSnapshot();
  });

  it('should handle playlist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(playerPlaylistTracks));

    await expect(
      getPreloadData('token', 'spotify:playlist:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toMatchSnapshot();
  });

  it('should handle show', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(playerShow));
    fetchMock.mockResponseOnce(JSON.stringify(playerShow.episodes));

    await expect(
      getPreloadData('token', 'spotify:show:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toMatchSnapshot();
  });

  it('should handle track', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(playerTrack));

    await expect(
      getPreloadData('token', 'spotify:track:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toMatchSnapshot();
  });

  it('should handle invalid type', async () => {
    await expect(
      getPreloadData('token', 'spotify:episode:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toBeNull();

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    fetchMock.mockRejectOnce(new Error('API error'));

    await expect(
      getPreloadData('token', 'spotify:track:7A0awCXkE1FtSU8B0qwOJQ', 0),
    ).resolves.toBeNull();

    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('getSpotifyLink', () => {
  it('should return a Spotify link', () => {
    expect(getSpotifyLink('spotify:track:63DTXKZi7YdJ4tzGti1Dtr')).toBe(
      'https://open.spotify.com/track/63DTXKZi7YdJ4tzGti1Dtr',
    );
  });
});

describe('getSpotifyLinkTitle', () => {
  it('should return a formatted title', () => {
    expect(getSpotifyLinkTitle('Hommer', getLocale().title)).toBe('Hommer on SPOTIFY');
  });
});

describe('getSpotifyURIType', () => {
  it.each([
    ['spotify:album:51QBkcL7S3KYdXSSA0zM9R', 'album'],
    ['spotify:artist:7A0awCXkE1FtSU8B0qwOJQ', 'artist'],
    ['spotify:episode:6r8OOleI5xP7qCEipHvdyK', 'episode'],
    ['spotify:playlist:5kHMGRfZHORA4UrCbhYyad', 'playlist'],
    ['spotify:show:5huEzXsf133dhbh57Np2tg', 'show'],
    ['spotify:track:0gkVD2tr14wCfJhqhdE94L', 'track'],
    ['spotify:user:gilbarbara', 'user'],
    ['spotify', ''],
  ])('%s should return %s', (value, expected) => {
    expect(getSpotifyURIType(value)).toBe(expected);
  });
});
