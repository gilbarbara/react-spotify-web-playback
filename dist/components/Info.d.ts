/// <reference types="react" />
import { Locale, StylesOptions } from '../types/common';
import { SpotifyPlayerTrack } from '../types/spotify';
interface Props {
    isActive: boolean;
    locale: Locale;
    onFavoriteStatusChange: (status: boolean) => any;
    showSaveIcon: boolean;
    styles: StylesOptions;
    token: string;
    track: SpotifyPlayerTrack;
    updateSavedStatus?: (fn: (status: boolean) => any) => any;
}
export default function Info(props: Props): JSX.Element;
export {};
