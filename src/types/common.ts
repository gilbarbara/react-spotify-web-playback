import * as React from 'react';
import { IPlayerTrack, IWebPlaybackTrack } from './spotify';

export interface ICallbackState extends IState {
  type: string;
}

export interface IProps {
  autoPlay?: boolean;
  callback?: (state: ICallbackState) => any;
  magnifySliderOnHover?: boolean;
  name?: string;
  offset?: number;
  persistDeviceSelection?: boolean;
  play?: boolean;
  showSaveIcon?: boolean;
  styles?: IStylesProps;
  syncExternalDeviceInterval?: number;
  token: string;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
  uris?: string | string[];
}

export interface IState {
  currentDeviceId: string;
  deviceId: string;
  error: string;
  errorType: string;
  isActive: boolean;
  isInitializing: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isSaved: boolean;
  isUnsupported: boolean;
  needsUpdate: boolean;
  nextTracks: IWebPlaybackTrack[];
  position: number;
  previousTracks: IWebPlaybackTrack[];
  progressMs?: number;
  status: string;
  track: IPlayerTrack;
  volume: number;
}

export interface IPlayOptions {
  context_uri?: string;
  uris?: string[];
}

export interface IStylesOptions {
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

export interface IStylesProps extends Partial<IStylesOptions> {}

export interface IStyledComponentProps {
  children?: React.ReactNode;
  styles: IStylesOptions;
  [key: string]: any;
}
