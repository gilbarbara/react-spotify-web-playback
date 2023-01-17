import { Locale } from './types';
export declare const canUseDOM: () => boolean;
export declare const STATUS: {
    ERROR: string;
    IDLE: string;
    INITIALIZING: string;
    READY: string;
    RUNNING: string;
    UNSUPPORTED: string;
};
export declare const TYPE: {
    DEVICE: string;
    FAVORITE: string;
    PLAYER: string;
    PROGRESS: string;
    STATUS: string;
    TRACK: string;
};
export declare function getLocale(locale?: Partial<Locale>): Locale;
export declare function getSpotifyLink(uri: string): string;
export declare function getSpotifyLinkTitle(name: string, locale: string): string;
export declare function getSpotifyURIType(uri: string): string;
export declare function isNumber(value: unknown): value is number;
export declare function loadSpotifyPlayer(): Promise<any>;
export declare function parseVolume(value?: unknown): number;
/**
 * Round decimal numbers
 */
export declare function round(number: number, digits?: number): number;
export declare function validateURI(input: string): boolean;
