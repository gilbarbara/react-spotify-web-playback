/* eslint-disable camelcase */
import { SPOTIFY_CONTENT_TYPE, TRANSPARENT_COLOR } from '~/constants';
import { parseIds, validateURI } from '~/modules/helpers';
import {
  getAlbumTracks,
  getArtistTopTracks,
  getPlaylistTracks,
  getShow,
  getShowEpisodes,
  getTrack,
} from '~/modules/spotify';

import { IDs, Locale, RepeatState, SpotifyTrack, StylesOptions, StylesProps } from '~/types';

export function getBgColor(bgColor: string, fallbackColor?: string): string {
  if (fallbackColor) {
    return bgColor === TRANSPARENT_COLOR ? fallbackColor : bgColor;
  }

  return bgColor === 'transparent' ? TRANSPARENT_COLOR : bgColor;
}

export function getItemImage(item: { images: Spotify.Image[] }): string {
  const maxWidth = Math.max(...item.images.map(d => d.width ?? 0));

  return item.images.find(d => d.width === maxWidth)?.url ?? '';
}

export function getLocale(locale?: Partial<Locale>): Locale {
  return {
    currentDevice: 'Current device',
    devices: 'Devices',
    next: 'Next',
    otherDevices: 'Select other device',
    pause: 'Pause',
    play: 'Play',
    previous: 'Previous',
    removeTrack: 'Remove from your favorites',
    saveTrack: 'Save to your favorites',
    title: '{name} on SPOTIFY',
    volume: 'Volume',
    ...locale,
  };
}

export function getMergedStyles(styles?: StylesProps): StylesOptions {
  const mergedStyles = {
    activeColor: '#1cb954',
    bgColor: '#fff',
    color: '#333',
    errorColor: '#ff0026',
    height: 80,
    loaderColor: '#ccc',
    loaderSize: 32,
    sliderColor: '#666',
    sliderHandleBorderRadius: '50%',
    sliderHandleColor: '#000',
    sliderHeight: 4,
    sliderTrackBorderRadius: 4,
    sliderTrackColor: '#ccc',
    trackArtistColor: '#666',
    trackNameColor: '#333',
    ...styles,
  };

  mergedStyles.bgColor = getBgColor(mergedStyles.bgColor);

  return mergedStyles;
}

export async function getPreloadData(
  token: string,
  uris: IDs,
  offset: number,
): Promise<SpotifyTrack | null> {
  const parsedURIs = parseIds(uris);
  const uri = parsedURIs[offset];

  if (!validateURI(uri)) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('PreloadData: Invalid URI', parsedURIs[offset]);
    }

    return null;
  }

  const [, type, id] = uri.split(':');

  try {
    switch (type) {
      case SPOTIFY_CONTENT_TYPE.ALBUM: {
        const { items } = await getAlbumTracks(token, id);
        const track = await getTrack(token, items[offset].id);

        return getTrackInfo(track);
      }
      case SPOTIFY_CONTENT_TYPE.ARTIST: {
        const { tracks } = await getArtistTopTracks(token, id);

        return getTrackInfo(tracks[offset]);
      }
      case SPOTIFY_CONTENT_TYPE.PLAYLIST: {
        const { items } = await getPlaylistTracks(token, id);

        if (items[offset]?.track) {
          return getTrackInfo(items[offset]?.track);
        }

        return null;
      }
      case SPOTIFY_CONTENT_TYPE.SHOW: {
        const show = await getShow(token, id);
        const { items } = await getShowEpisodes(
          token,
          id,
          show.total_episodes ? show.total_episodes - 1 : 0,
        );

        const episode = items?.[0] ?? {
          duration_ms: 0,
          id: show.id,
          images: show.images,
          name: show.name,
          uri: show.uri,
        };

        return {
          artists: [{ name: show.name, uri: show.uri }],
          durationMs: episode.duration_ms,
          id: episode.id,
          image: getItemImage(episode),
          name: episode.name,
          uri: episode.uri,
        };
      }
      default: {
        const track = await getTrack(token, id);

        return getTrackInfo(track);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PreloadData:', error);

    return null;
  }
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

export function getSpotifyLink(uri: string): string {
  const [, type = '', id = ''] = uri.split(':');

  return `https://open.spotify.com/${type}/${id}`;
}

export function getSpotifyLinkTitle(name: string, locale: string): string {
  return locale.replace('{name}', name);
}

export function getSpotifyURIType(uri: string): string {
  const [, type = ''] = uri.split(':');

  return type;
}

export function getTrackInfo(track: Spotify.Track | SpotifyApi.TrackObjectFull): SpotifyTrack {
  const { album, artists, duration_ms, id, name, uri } = track;

  return {
    artists,
    durationMs: duration_ms,
    id: id ?? '',
    image: getItemImage(album),
    name,
    uri,
  };
}
