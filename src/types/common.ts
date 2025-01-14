import { ReactNode } from 'react';

import { ERROR_TYPE, STATUS, TYPE } from '~/constants';

import { SpotifyDevice, SpotifyTrack } from './spotify';

export type ErrorType = (typeof ERROR_TYPE)[keyof typeof ERROR_TYPE];
export type IDs = string | string[];
export type Layout = 'responsive' | 'compact';
export type RepeatState = 'off' | 'context' | 'track';
export type Status = (typeof STATUS)[keyof typeof STATUS];
export type StylesProps = Partial<StylesOptions>;

export type Type = (typeof TYPE)[keyof typeof TYPE];

export interface CallbackState extends State {
  type: Type;
}

export interface ComponentsProps {
  [key: string]: any;
  children?: ReactNode;
  styles: StylesOptions;
}

export interface CustomComponents {
  /**
   * A React component to be displayed before the previous button.
   */
  leftButton?: ReactNode;
  /**
   * A React component to be displayed after the next button.
   */
  rightButton?: ReactNode;
}

export interface Locale {
  currentDevice: string;
  devices: string;
  next: string;
  otherDevices: string;
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

export interface Props {
  /**
   * Start the player immediately.
   * @default false
   * @deprecated Most browsers block autoplaying since the user needs to interact with the page first.
   */
  autoPlay?: boolean;
  /**
   * Get status updates from the player.
   */
  callback?: (state: CallbackState) => any;
  /**
   * Custom components for the player.
   */
  components?: CustomComponents;
  /**
   * The callback Spotify SDK uses to get/update the token.
   */
  getOAuthToken?: (callback: (token: string) => void) => Promise<void>;
  /**
   * Get the Spotify Web Playback SDK instance.
   */
  getPlayer?: (player: Spotify.Player) => void;
  /**
   * Hide the Spotify logo.
   * More info: https://developer.spotify.com/documentation/general/design-and-branding/
   * @default false
   */
  hideAttribution?: boolean;
  /**
   * Hide the cover art.
   * @default false
   */
  hideCoverArt?: boolean;
  /**
   * The initial volume for the player. This isn't used for external devices.
   * @default 1
   */
  initialVolume?: number;
  /**
   * Show the volume inline for the "responsive" layout for 768px and above.
   * @default true
   */
  inlineVolume?: boolean;
  /**
   * The layout of the player.
   * @default responsive
   */
  layout?: Layout;
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
   * Preload the track data before playing.
   */
  preloadData?: boolean;
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
  uris: string | string[];
}

export interface State {
  currentDeviceId: string;
  currentURI: string;
  deviceId: string;
  devices: SpotifyDevice[];
  error: string;
  errorType: ErrorType | null;
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
  repeat: RepeatState;
  shuffle: boolean;
  status: Status;
  track: SpotifyTrack;
  volume: number;
}

export interface StyledProps {
  [key: string]: any;
  style: Record<string, any>;
}

export interface StylesOptions {
  activeColor: string;
  bgColor: string;
  color: string;
  errorColor: string;
  height: number;
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
