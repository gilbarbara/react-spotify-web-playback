import * as React from 'react';
import { SpotifyPlayerTrack, SpotifyDevice, WebPlaybackTrack } from './spotify';

export interface CallbackState extends State {
  type: string;
}

export interface Props {
  autoPlay?: boolean;
  callback?: (state: CallbackState) => any;
  magnifySliderOnHover?: boolean;
  name?: string;
  offset?: number;
  persistDeviceSelection?: boolean;
  play?: boolean;
  showSaveIcon?: boolean;
  styles?: StylesProps;
  syncExternalDeviceInterval?: number;
  token: string;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
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
  nextTracks: WebPlaybackTrack[];
  position: number;
  previousTracks: WebPlaybackTrack[];
  progressMs?: number;
  status: string;
  track: SpotifyPlayerTrack;
  volume: number;
}

export interface PlayOptions {
  context_uri?: string;
  uris?: string[];
}

export interface StylesOptions {
  altColor: string;
  bgColor: string;
  color: string;
  errorColor: string;
  height: number | string;
  loaderColor: string;
  loaderSize: number | string;
  savedColor: string;
  sliderHandleColor: string;
  sliderHandleBorderRadius: number | string;
  sliderHeight: number;
  sliderColor: string;
  sliderTrackBorderRadius: number | string;
  sliderTrackColor: string;
  trackArtistColor: string;
  trackNameColor: string;
}

export type StylesProps = Partial<StylesOptions>;

export interface StyledComponentProps {
  children?: React.ReactNode;
  styles: StylesOptions;
  [key: string]: any;
}
