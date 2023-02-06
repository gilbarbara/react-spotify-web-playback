import {
  getLocale,
  getSpotifyLink,
  getSpotifyLinkTitle,
  getSpotifyURIType,
} from '~/modules/getters';

describe('getLocale', () => {
  it('should return a merged locale', () => {
    expect(getLocale({ currentDevice: 'Selected device ' })).toMatchSnapshot();
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
  ])('%p should return %p', (value, expected) => {
    expect(getSpotifyURIType(value)).toBe(expected);
  });
});
