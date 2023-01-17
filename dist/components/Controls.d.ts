/// <reference types="react" />
import { Spotify } from '../../global';
import { Locale, StylesOptions } from '../types';
interface Props {
    isExternalDevice: boolean;
    isPlaying: boolean;
    locale: Locale;
    nextTracks: Spotify.Track[];
    onClickNext: () => void;
    onClickPrevious: () => void;
    onClickTogglePlay: () => void;
    previousTracks: Spotify.Track[];
    styles: StylesOptions;
}
export default function Controls(props: Props): JSX.Element;
export {};
