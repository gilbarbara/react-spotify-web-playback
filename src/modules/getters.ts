import { Locale } from '~/types';

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
