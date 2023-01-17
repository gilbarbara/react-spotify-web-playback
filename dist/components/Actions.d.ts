/// <reference types="react" />
import { Locale, StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';
interface Props {
    currentDeviceId: string;
    deviceId: string;
    devices: SpotifyDevice[];
    isDevicesOpen: boolean;
    locale: Locale;
    onClickDevice: (deviceId: string) => any;
    playerPosition: string;
    setVolume: (volume: number) => any;
    styles: StylesOptions;
    volume: number;
}
export default function Actions(props: Props): JSX.Element;
export {};
