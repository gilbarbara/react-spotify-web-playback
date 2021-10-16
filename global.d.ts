import 'jest-extended';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}
