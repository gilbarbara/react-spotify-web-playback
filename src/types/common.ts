/* eslint-disable camelcase */
import { ReactNode } from 'react';

import { SpotifyDevice, SpotifyPlayerTrack, SpotifyTrack } from './spotify';

export interface CallbackState extends State {
  type: string;
}

export interface Props {
  /**
   * Start the player immediately.
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Get status updates from the player.
   */
  callback?: (state: CallbackState) => any;
  /**
   * The initial volume for the player. This isn't used for external devices.
   * @default 1
   */
  initialVolume?: number;
  /**
   * The strings used for aria-label/title attributes.
   */
  locale?: Partial<Locale>;
  /**
   * Magnify the player's slider on hover.
   * @default false
   */
  magnifySliderOnHover?: boolean;
  /**
   * The name of the player.
   * @default Spotify Web Player
   */
  name?: string;
  /**
   * The position of the list/tracks you want to start the player.
   */
  offset?: number;
  /**
   * Save the device selection.
   * @default false
   */
  persistDeviceSelection?: boolean;
  /**
   * Control the player's status.
   */
  play?: boolean;
  /**
   * Display a Favorite button. It needs additional scopes in your token.
   * @default false
   */
  showSaveIcon?: boolean;
  /**
   * Customize the player's appearance.
   */
  styles?: StylesProps;
  /**
   * If there are no URIs and an external device is playing, use the external player context.
   *  @default false
   */
  syncExternalDevice?: boolean;
  /**
   * The time in seconds that the player will sync with external devices.
   * @default 5
   */
  syncExternalDeviceInterval?: number;
  /**
   * A Spotify token.
   */
  token: string;
  /**
   * Provide you with a function to sync the track saved status in the player.
   * This works in addition to the showSaveIcon prop, and it is only needed if you keep the track's saved status in your app.
   */
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
  /**
   * A list of Spotify URIs.
   */
  uris?: string | string[];
}

export interface State {
  currentDeviceId: string;
  deviceId: string;
  devices: SpotifyDevice[];
  error: string;
  errorType: string;
  isActive: boolean;
  isInitializing: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isSaved: boolean;
  isUnsupported: boolean;
  needsUpdate: boolean;
  nextTracks: SpotifyTrack[];
  playerPosition: 'bottom' | 'top';
  position: number;
  previousTracks: SpotifyTrack[];
  progressMs: number;
  status: string;
  track: SpotifyPlayerTrack;
  volume: number;
}

export interface ComponentsProps {
  [key: string]: any;
  children?: ReactNode;
  styles: StylesOptions;
}

export interface Locale {
  devices: string;
  next: string;
  pause: string;
  play: string;
  previous: string;
  removeTrack: string;
  saveTrack: string;
  title: string;
  volume: string;
}

export interface PlayOptions {
  context_uri?: string;
  uris?: string[];
}

export interface StylesOptions {
  activeColor: string;
  altColor: string;
  bgColor: string;
  color: string;
  errorColor: string;
  height: number | string;
  loaderColor: string;
  loaderSize: number | string;
  sliderColor: string;
  sliderHandleBorderRadius: number | string;
  sliderHandleColor: string;
  sliderHeight: number;
  sliderTrackBorderRadius: number | string;
  sliderTrackColor: string;
  trackArtistColor: string;
  trackNameColor: string;
}

export type StylesProps = Partial<StylesOptions>;

export interface StyledProps {
  [key: string]: any;
  style: Record<string, any>;
}
