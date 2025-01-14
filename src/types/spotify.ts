export type SpotifyAlbum = Spotify.Album;

export type SpotifyArtist = SpotifyApi.ArtistObjectSimplified;

export type SpotifyDevice = SpotifyApi.UserDevice;

export type SpotifyPlayerCallback = (token: string) => void;

export interface SpotifyPlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

export interface SpotifyTrack {
  artists: Pick<SpotifyArtist, 'name' | 'uri'>[];
  durationMs: number;
  id: string;
  image: string;
  name: string;
  uri: string;
}

export interface WebPlaybackArtist {
  name: string;
  uri: string;
}
