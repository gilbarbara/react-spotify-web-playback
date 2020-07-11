import React, { useCallback, useRef, useState } from 'react';
import { hot } from 'react-hot-loader';
import SpotifyWebPlayer, { STATUS } from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';

import {
  Button,
  Disclaimer,
  Form,
  GlobalStyles,
  Heading,
  Input,
  List,
  Player,
  ScopeTitle,
  Selector,
} from './component';

const validateURI = (input: string): boolean => {
  let isValid = false;

  if (input && input.indexOf(':') > -1) {
    const [key, type, id] = input.split(':');

    if (key && type && type !== 'user' && id && id.length === 22) {
      isValid = true;
    }
  }

  return isValid;
};

const parseURIs = (input: string): string[] => {
  const ids = input.split(',');

  return ids.every((d) => validateURI(d)) ? ids : [];
};

const App = () => {
  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
  ];
  const savedToken = localStorage.getItem('rswp_token');
  const URIsInput = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState(savedToken || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [URIs, setURIs] = useState<string[]>(['spotify:album:51QBkcL7S3KYdXSSA0zM9R']);
  const [validURI, setValidURI] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const token = e.target.elements[0].value;

    if (token) {
      setToken(token);
      localStorage.setItem('rswp_token', token);
      e.target.reset();
    }
  }, []);

  const handleSubmitURIs = useCallback((e) => {
    e.preventDefault();

    if (URIsInput && URIsInput.current) {
      setURIs(parseURIs(URIsInput.current.value));
    }
  }, []);

  const handleChangeURIs = useCallback((e) => {
    e.preventDefault();

    if (URIsInput && URIsInput.current) {
      setValidURI(!!parseURIs(URIsInput.current.value).length);
    }
  }, []);

  const handleClickURIs = useCallback((e) => {
    e.preventDefault();
    const { uris } = e.currentTarget.dataset;

    setURIs(parseURIs(uris));
    setIsPlaying(true);

    if (URIsInput && URIsInput.current) {
      URIsInput.current.value = uris;
    }
  }, []);

  const handleCallback = useCallback(({ type, ...state }: CallbackState) => {
    console.group(`RSWP: ${type}`);
    console.log(state);
    console.groupEnd();

    setIsPlaying(state.isPlaying);

    if (state.status === STATUS.ERROR && state.errorType === 'authentication_error') {
      localStorage.removeItem('rswp_token');
      setToken('');
    }
  }, []);

  return (
    <div className="App">
      <GlobalStyles />
      <Heading>React Spotify Web Playback Demo</Heading>

      {!token && (
        <React.Fragment>
          <Form onSubmit={handleSubmit}>
            <Input type="text" name="token" placeholder="Enter a Spotify token" />
            <Button type="submit">✓</Button>
          </Form>
          <Disclaimer>
            <ScopeTitle>Required scopes</ScopeTitle>
            <List>
              {scopes.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </List>
            <p>
              Get one{' '}
              <a
                href={`https://accounts.spotify.com/en/authorize?response_type=token&client_id=adaaf209fb064dfab873a71817029e0d&redirect_uri=https:%2F%2Fdeveloper.spotify.com%2Fdocumentation%2Fweb-playback-sdk%2Fquick-start%2F&scope=${scopes.join(
                  '%20',
                )}&show_dialog=true`}
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
            </p>
          </Disclaimer>
        </React.Fragment>
      )}
      {token && (
        <React.Fragment>
          <Form onSubmit={handleSubmitURIs}>
            <Input
              ref={URIsInput}
              name="uris"
              defaultValue={URIs.join(',')}
              placeholder="Enter a Spotify URI"
              onChange={handleChangeURIs}
            />
            <Button type="submit" disabled={!validURI}>
              ✓
            </Button>
          </Form>
          <Selector>
            <button onClick={handleClickURIs} data-uris="spotify:artist:7A0awCXkE1FtSU8B0qwOJQ">
              Play an Artist
            </button>
            <button onClick={handleClickURIs} data-uris="spotify:album:51QBkcL7S3KYdXSSA0zM9R">
              Play an Album
            </button>
            <button onClick={handleClickURIs} data-uris="spotify:playlist:5kHMGRfZHORA4UrCbhYyad">
              Play a Playlist
            </button>
            <button
              onClick={handleClickURIs}
              data-uris={[
                'spotify:track:0gkVD2tr14wCfJhqhdE94L',
                'spotify:track:0E7S1k9M1KshLISVC2EP1M',
                'spotify:track:2WIUbg8CiAsKuQMw9DzZ1d',
                'spotify:track:2aJDlirz6v2a4HREki98cP',
                'spotify:track:6ap5AekhAt3k6e0zAknDyV',
                'spotify:track:6GNXHie8d6aN0rxFMnj2tx',
                'spotify:track:3C3VCp0ajmW9timvqBmiHf',
              ].join(',')}
            >
              Play some Tracks
            </button>
          </Selector>
        </React.Fragment>
      )}

      <Player key={token}>
        {token && (
          <SpotifyWebPlayer
            autoPlay={false}
            callback={handleCallback}
            persistDeviceSelection
            play={isPlaying}
            showSaveIcon
            syncExternalDevice
            token={token}
            styles={{
              sliderColor: '#1cb954',
            }}
            uris={URIs}
          />
        )}
      </Player>
      <a
        href="https://github.com/gilbarbara/react-spotify-web-playback"
        target="_blank"
        rel="noopener noreferrer"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            className="octo-arm"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          />
        </svg>
      </a>
    </div>
  );
};

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
