# react-spotify-web-playback

[![npm version](https://badge.fury.io/js/react-spotify-web-playback.svg)](https://www.npmjs.com/package/react-spotify-web-playback) [![CI](https://github.com/gilbarbara/react-spotify-web-playback/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/react-spotify-web-playback/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/9b6d6817ca7bdfe47f5e/maintainability)](https://codeclimate.com/github/gilbarbara/react-spotify-web-playback/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/9b6d6817ca7bdfe47f5e/test_coverage)](https://codeclimate.com/github/gilbarbara/react-spotify-web-playback/test_coverage)

#### A Spotify player with [Spotify's Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/).

View the [demo](https://react-spotify-web-playback.gilbarbara.dev/)

Check the [supported browser](https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers) list. This library will try to use the user's devices to work with unsupported browsers.

## Setup

```bash
npm i react-spotify-web-playback
```

## Getting Started

```jsx
import SpotifyPlayer from 'react-spotify-web-playback';

<SpotifyPlayer
  token="BQAI_7RWPJuqdZxS-I8XzhkUi9RKr8Q8UUNaJAHwWlpIq6..."
  uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
/>;
```

### Client-side only

If you are using an SSR framework, you'll need to use a [dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import) to load the player.

## Props

**callback** `(state: CallbackState) => void`  
Get status updates from the player.

<details>
  <summary>Type Definition</summary>

```typescript
type ErrorType = 'account' | 'authentication' | 'initialization' | 'playback' | 'player';
type Status = 'ERROR' | 'IDLE' | 'INITIALIZING' | 'READY' | 'RUNNING' | 'UNSUPPORTED';
type Type =
  | 'device_update'
  | 'favorite_update'
  | 'player_update'
  | 'progress_update'
  | 'status_update'
  | 'track_update';

interface State {
  currentDeviceId: string;
  deviceId: string;
  devices: SpotifyDevice[];
  error: string;
  errorType: ErrorType | null;
  isActive: boolean;
  isInitializing: boolean;
  isMagnified: boolean;
  isPlaying: boolean;
  isSaved: boolean;
  isUnsupported: boolean;
  needsUpdate: boolean;
  nextTracks: SpotifyTrack[];
  playerPosition: 'bottom' | 'top';
  position: number;
  previousTracks: SpotifyTrack[];
  progressMs: number;
  status: Status;
  track: SpotifyTrack;
  volume: number;
}

interface CallbackState extends State {
  type: Type;
}
```

</details>

**getOAuthToken** `(callback: (token: string) => void) => Promise<void>`  
The callback Spotify SDK uses to get/update the token. _Use it to generate a new token when the player needs it._

**hideAttribution** `boolean` ▶︎ false  
Hide the Spotify logo.

**hideCoverArt** `boolean` ▶︎ false  
Hide the cover art

**initialVolume** `number` between 0 and 1. ▶︎ 1  
The initial volume for the player. It's not used for external devices.

**inlineVolume** `boolean` ▶︎ true  
Show the volume inline for the "responsive" layout for 768px and above.

**layout** `'compact' | 'responsive'` ▶︎ 'responsive'  
The layout of the player.

**locale** `Locale`  
The strings used for aria-label/title attributes.

<details>
  <summary>Type Definition</summary>

```typescript
interface Locale {
  currentDevice?: string; // 'Current device'
  devices?: string; // 'Devices'
  next?: string; // 'Next'
  otherDevices?: string; // 'Select other device'
  pause?: string; // 'Pause'
  play?: string; // 'Play'
  previous?: string; // 'Previous'
  removeTrack?: string; // 'Remove from your favorites'
  saveTrack?: string; // 'Save to your favorites'
  title?: string; // '{name} on SPOTIFY'
  volume?: string; // 'Volume'
}
```

</details>

**magnifySliderOnHover**: `boolean` ▶︎ false  
Magnify the player's slider on hover.

**name** `string` ▶︎ 'Spotify Web Player'  
The name of the player.

**offset** `number`  
The position of the list/tracks you want to start the player.

**persistDeviceSelection** `boolean` ▶︎ false  
Save the device selection.

**play** `boolean`  
Control the player's status.

**showSaveIcon** `boolean` ▶︎ false  
Display a Favorite button. It needs additional scopes in your token.

**styles** `object`  
Customize the player's appearance. Check `StylesOptions` in the [types](src/types/common.ts).

**syncExternalDevice** `boolean` ▶︎ false  
If there are no URIs and an external device is playing, use the external player context.

**syncExternalDeviceInterval** `number` ▶︎ 5  
The time in seconds that the player will sync with external devices.

**token** `string` **REQUIRED**  
A Spotify token. More info is below.

**updateSavedStatus** `(fn: (status: boolean) => any) => any`  
Provide you with a function to sync the track saved status in the player.  
_This works in addition to the **showSaveIcon** prop, and it is only needed if you keep track's saved status in your app._

**uris** `string | string[]` **REQUIRED**  
A list of Spotify [URIs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids).

## Spotify Token

It needs a Spotify token with the following scopes:

- streaming
- user-read-email
- user-read-private
- user-read-playback-state (to read other devices' status)
- user-modify-playback-state (to update other devices)

If you want to show the Favorite button (💚), you'll need the additional scopes:

- user-library-read
- user-library-modify

Please refer to Spotify's Web API [docs](https://developer.spotify.com/documentation/web-api/) for more information.

> This library doesn't handle token generation and expiration. You'll need to handle that by yourself.

## Styling

You can customize the UI with a `styles` prop. Check all the available options [here](src/types/common.ts#L159).

```tsx
<SpotifyWebPlayer
  // ...
  styles={{
    activeColor: '#fff',
    bgColor: '#333',
    color: '#fff',
    loaderColor: '#fff',
    sliderColor: '#1cb954',
    trackArtistColor: '#ccc',
    trackNameColor: '#fff',
  }}
/>
```

![rswp-styles](https://gilbarbara.com/files/rswp-styles-e4060ddf.png)

## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/gilbarbara/react-spotify-web-playback/issues).

## License

MIT
