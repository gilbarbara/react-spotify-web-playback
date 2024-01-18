import { TRANSPARENT_COLOR } from '~/constants';
import { Locale, StylesOptions, StylesProps } from '~/types';

export function getBgColor(bgColor: string, fallbackColor?: string): string {
  if (fallbackColor) {
    return bgColor === TRANSPARENT_COLOR ? fallbackColor : bgColor;
  }

  return bgColor === 'transparent' ? TRANSPARENT_COLOR : bgColor;
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
    altColor: '#ccc',
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
