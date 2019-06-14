import React from 'react';
import { PlayerTrack, WebPlaybackTrack } from './spotify';

export interface CallbackState extends State {
  type: string;
}

export interface Props {
  autoPlay?: boolean;
  callback?: (state: CallbackState) => any;
  magnifySliderOnHover: boolean;
  name?: string;
  offset?: number;
  persistDeviceSelection?: boolean;
  play?: boolean;
  showSaveIcon?: boolean;
  syncExternalDeviceInterval?: number;
  token: string;
  styles?: StylesProps;
  uris?: string | string[];
}

export interface State {
  currentDeviceId: string;
  deviceId: string;
  error: string;
  errorType: string;
  isActive: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isUnsupported: boolean;
  nextTracks: WebPlaybackTrack[];
  position: number;
  previousTracks: WebPlaybackTrack[];
  progressMs?: number;
  status: string;
  track: PlayerTrack;
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
  rangeHandleColor: string;
  rangeHandleBorderRadius: number | string;
  rangeHeight: number;
  rangeColor: string;
  rangeTrackBorderRadius: number | string;
  rangeTrackColor: string;
  savedColor: string;
  trackArtistColor: string;
  trackNameColor: string;
}

export interface StylesProps extends Partial<StylesOptions> {}

export interface StyledComponentProps {
  children?: React.ReactNode;
  styles: StylesOptions;
  [key: string]: any;
}
