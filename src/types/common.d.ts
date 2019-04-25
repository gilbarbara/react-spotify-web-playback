import React from 'react';

export interface StylesOptions {
  bgColor: string;
  color: string;
  errorColor: string;
  height: number | string;
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
