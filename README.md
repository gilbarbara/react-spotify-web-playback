# react-spotify-web-playback

[![npm version](https://badge.fury.io/js/react-spotify-web-playback.svg)](https://www.npmjs.com/package/react-spotify-web-playback) [![build status](https://travis-ci.org/gilbarbara/react-spotify-web-playback.svg)](https://travis-ci.org/gilbarbara/react-spotify-web-playback) [![Maintainability](https://api.codeclimate.com/v1/badges/9b6d6817ca7bdfe47f5e/maintainability)](https://codeclimate.com/github/gilbarbara/react-spotify-web-playback/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/9b6d6817ca7bdfe47f5e/test_coverage)](https://codeclimate.com/github/gilbarbara/react-spotify-web-playback/test_coverage)

#### A Spotify player with [Spotify's Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/).

View the [demo](https://react-spotify-web-playback.gilbarbara.dev/)

Check the [supported browser](https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers) list. This library will try to use the user's devices to work with mobile and unsupported browsers.

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

## Props

**autoPlay**: `boolean`  
Start the player immediately.

**callback**: `(state) => any`  
Get status updates from the player. Check `CallbackState` in the [types](src/types/common.ts) for the `state` structure.

**initialVolume** `number` between 0 and 1. _default 1_  
The initial volume for the player. It's not used for external devices.

**magnifySliderOnHover**: `boolean`  
Magnify the player's slider on hover.

**name** `string` _default: Spotify Web Player_  
The name of the player.

**offset** `number`  
The position of the list/tracks you want to start the player.

**persistDeviceSelection** `boolean`  
Save the device selection.

**play** `boolean`  
Control the player status

**showSaveIcon** `boolean`  
Display a Favorite button. Needs additional scopes in your token!

**styles** `object`  
Customize the player appearance. Check `StylesOptions` in the [types](src/types/common.ts).

**syncExternalDevice** `boolean`
If there are no URIs and an external device is playing, use the external player context.

**syncExternalDeviceInterval** `number` _default: 5_  
The time in seconds that the player will sync with external devices

**token** `string` **REQUIRED**  
A Spotify token. More info below.

**updateSavedStatus** `(fn: (status: boolean) => any) => any`  
Provide you with a function to sync the track saved status in the player.  
_This works in addition to the **showSaveIcon** prop and it is only needed if you keep the track saved status in your app._

**uris** `string | string[]`  
A list of Spotify [URIs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids).

## Spotify Token

It needs a Spotify token with the following scopes:

- streaming
- user-read-email
- user-read-private
- user-read-playback-state (to read other devices' status)
- user-modify-playback-state (to update other devices)

If you want to show the Favorite button (💚) you'll need the additional scopes:

- user-library-read
- user-library-modify

Please refer to Spotify's Web API [docs](https://developer.spotify.com/documentation/web-api/) for more information.

> This library doesn't handle token generation and expiration. You'll need to handle that by yourself.

## Styling

You can customize the UI with a `styles` prop. Check all the available options [here](src/types/common.ts#L44).

```tsx
<SpotifyWebPlayer
  ...
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
