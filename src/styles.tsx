/* eslint-disable import/extensions */
/* tslint:disable:object-literal-sort-keys */
import { createElement, FunctionComponent } from 'react';
import { create, CssLikeObject, NanoRenderer } from 'nano-css';
// @ts-ignore
import { addon as addonJSX } from 'nano-css/addon/jsx.js';
import { addon as addonKeyframes } from 'nano-css/addon/keyframes.js';
// @ts-ignore
import { addon as addonNesting } from 'nano-css/addon/nesting.js';
import { addon as addonRule } from 'nano-css/addon/rule.js';
// @ts-ignore
import { addon as addonStyle } from 'nano-css/addon/style.js';
// @ts-ignore
import { addon as addonStyled } from 'nano-css/addon/styled.js';

import { StyledProps, StylesOptions, StylesProps } from './types/common';

interface NanoExtended extends NanoRenderer {
  styled: (
    tag: string,
  ) => (
    styles: CssLikeObject,
    dynamicTemplate?: (props: StyledProps) => CssLikeObject,
    block?: string,
  ) => FunctionComponent<Partial<StyledProps>>;
}

const nano = create({ h: createElement });

addonRule(nano);
addonKeyframes(nano);
addonJSX(nano);
addonStyle(nano);
addonStyled(nano);
addonNesting(nano);

const { keyframes, put, styled } = nano as NanoExtended;

export const px = (value: string | number): string =>
  typeof value === 'number' ? `${value}px` : value;

export function getMergedStyles(styles: StylesProps | undefined): StylesOptions {
  return {
    activeColor: '#1cb954',
    altColor: '#ccc',
    bgColor: '#fff',
    color: '#333',
    errorColor: '#a60000',
    height: 48,
    loaderColor: '#ccc',
    loaderSize: 32,
    sliderColor: '#666',
    sliderHandleBorderRadius: '50%',
    sliderHandleColor: '#000',
    sliderHeight: 4,
    sliderTrackBorderRadius: 0,
    sliderTrackColor: '#ccc',
    trackArtistColor: '#666',
    trackNameColor: '#333',
    ...styles,
  };
}

export { keyframes, put, styled };
