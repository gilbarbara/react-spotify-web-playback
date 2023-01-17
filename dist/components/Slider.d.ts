/// <reference types="react" />
import { StylesOptions } from '../types/common';
interface Props {
    isMagnified: boolean;
    onChangeRange: (position: number) => void;
    onToggleMagnify: () => void;
    position: number;
    styles: StylesOptions;
}
export default function Slider(props: Props): JSX.Element;
export {};
