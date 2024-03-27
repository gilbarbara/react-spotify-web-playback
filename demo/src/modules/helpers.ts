import { getCookie, removeCookie, setCookie } from '@gilbarbara/cookies';
import { request } from '@gilbarbara/helpers';

import { SpotifyCredentials } from '../types';

const COOKIE_NAME = 'RSWP_TOKENS';

const { NODE_ENV } = process.env;

export const SPOTIFY = {
  accountApiUrl: 'https://accounts.spotify.com',
  clientId: '2030beede5174f9f9b23ffc23ba0705c',
  redirectUri:
    NODE_ENV === 'production'
      ? 'https://react-spotify-web-playback.gilbarbara.dev'
      : 'http://localhost:3000',
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
  ],
};
export const API_URL = 'https://scripts.gilbarbara.dev/api';

export function getAuthorizeUrl() {
  const parameters = {
    client_id: SPOTIFY.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY.redirectUri,
    scope: SPOTIFY.scopes.join(' '),
    state: 'auth',
  };

  return `${SPOTIFY.accountApiUrl}/authorize?${new URLSearchParams(parameters)}`;
}

export function getCredentials() {
  const tokens = getCookie(COOKIE_NAME);

  if (tokens) {
    return JSON.parse(tokens) as SpotifyCredentials;
  }

  return {} as Partial<SpotifyCredentials>;
}

export function setCredentials(credentials: SpotifyCredentials) {
  setCookie(COOKIE_NAME, JSON.stringify(credentials));
}

export async function login(code: string) {
  return request<SpotifyCredentials>(`${API_URL}/spotifyGetUserCredentials`, {
    method: 'POST',
    body: { code, redirectUri: SPOTIFY.redirectUri },
  });
}

export function refreshCredentials(refreshToken: string) {
  return request<SpotifyCredentials>(`${API_URL}/spotifyRefreshToken`, {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logout() {
  removeCookie(COOKIE_NAME);
}

export function parseURIs(input: string): string[] {
  const ids = input.split(',');

  return ids.every(d => validateURI(d)) ? ids : [];
}

export function validateURI(input: string): boolean {
  let isValid = false;

  if (input && input.includes(':')) {
    const [key, type, id] = input.split(':');

    if (key && type && type !== 'user' && id && id.length === 22) {
      isValid = true;
    }
  }

  return isValid;
}
