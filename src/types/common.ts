/* eslint-disable camelcase */
import * as React from 'react';

import { SpotifyDevice, SpotifyPlayerTrack } from './spotify';

import { Spotify } from '../../global';

export interface CallbackState extends State {
  type: string;
}

export interface Props {
  autoPlay?: boolean;
  callback?: (state: CallbackState) => any;
  initialVolume?: number;
  locale?: Partial<Locale>;
  magnifySliderOnHover?: boolean;
  name?: string;
  offset?: number;
  persistDeviceSelection?: boolean;
  play?: boolean;
  showSaveIcon?: boolean;
  styles?: StylesProps;
  syncExternalDevice?: boolean;
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
  nextTracks: Spotify.Track[];
  playerPosition: 'bottom' | 'top';
  position: number;
  previousTracks: Spotify.Track[];
  progressMs: number;
  status: string;
  track: SpotifyPlayerTrack;
  volume: number;
}

export interface ComponentsProps {
  [key: string]: any;
  children?: React.ReactNode;
  styles: StylesOptions;
}

export interface Locale {
  devices: string;
  next: string;
  pause: string;
  play: string;
  previous: string;
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
