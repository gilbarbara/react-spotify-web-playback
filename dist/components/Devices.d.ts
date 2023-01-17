/// <reference types="react" />
import { StylesOptions } from '../types/common';
import { SpotifyDevice } from '../types/spotify';
interface Props {
    currentDeviceId?: string;
    deviceId?: string;
    devices: SpotifyDevice[];
    onClickDevice: (deviceId: string) => any;
    open: boolean;
    playerPosition: string;
    styles: StylesOptions;
    title: string;
}
export default function Devices(props: Props): JSX.Element;
export {};
