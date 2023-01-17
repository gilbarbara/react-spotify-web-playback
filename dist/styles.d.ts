import { FunctionComponent } from 'react';
import { CssLikeObject } from 'nano-css/types/common';
import { StyledProps, StylesOptions, StylesProps } from './types/common';
declare const keyframes: ((frames: object, block?: string | undefined) => string) | undefined, put: (selector: string, css: CssLikeObject, atrule?: string | undefined) => void, styled: (tag: string) => (styles: CssLikeObject, dynamicTemplate?: ((props: StyledProps) => CssLikeObject) | undefined, block?: string) => FunctionComponent<Partial<StyledProps>>;
export declare const px: (value: string | number) => string;
export declare function getMergedStyles(styles: StylesProps | undefined): StylesOptions;
export { keyframes, put, styled };
