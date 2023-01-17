/// <reference types="react" />
import { StylesOptions } from '../types/common';
interface Props {
    playerPosition: string;
    setVolume: (volume: number) => any;
    styles: StylesOptions;
    title: string;
    volume: number;
}
export default function Volume(props: Props): JSX.Element;
export {};
