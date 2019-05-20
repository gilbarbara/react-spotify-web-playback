/* tslint:disable:object-literal-sort-keys */
import React, { createElement as h } from 'react';
import { create, NanoRenderer } from 'nano-css';

import { addon as addonAtoms } from 'nano-css/addon/atoms';
// @ts-ignore
import { addon as addonJSX } from 'nano-css/addon/jsx';
import { addon as addonKeyframes } from 'nano-css/addon/keyframes';
// @ts-ignore
import { addon as addonNesting } from 'nano-css/addon/nesting';
import { addon as addonRule } from 'nano-css/addon/rule';
// @ts-ignore
import { addon as addonStyle } from 'nano-css/addon/style';
// @ts-ignore
import { addon as addonStyled } from 'nano-css/addon/styled';

import { CssLikeObject } from 'nano-css/types/common';
import { StyledComponentProps, StylesOptions, StylesProps } from './types/common';

interface NanoExtended extends NanoRenderer {
  styled: (
    tag: string,
  ) => (
    styles: CssLikeObject,
    dynamicTemplate?: (props: StyledComponentProps) => CssLikeObject,
    block?: string,
  ) => React.FunctionComponent<StyledComponentProps>;
}

const nano = create({ h });

addonRule(nano);
addonAtoms(nano);
addonKeyframes(nano);
addonJSX(nano);
addonStyle(nano);
addonStyled(nano);
addonNesting(nano);

const { keyframes, styled } = nano as NanoExtended;

export const px = (val: string | number): string => (typeof val === 'number' ? `${val}px` : val);

export function getMergedStyles(styles: StylesProps | undefined): StylesOptions {
  return {
    bgColor: '#fff',
    color: '#333',
    errorColor: '#a60000',
    height: 48,
    loaderSize: 32,
    rangeColor: '#666',
    rangeHandleBorderRadius: '50%',
    rangeHandleColor: '#000',
    rangeHeight: 4,
    rangeTrackBorderRadius: 0,
    rangeTrackColor: '#ccc',
    savedColor: '#1cb954',
    trackArtistColor: '#999',
    trackNameColor: '#333',
    ...styles,
  };
}

export { keyframes, styled };
