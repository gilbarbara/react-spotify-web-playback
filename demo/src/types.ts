export interface SpotifyCredentials {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
  scope: string[];
}
