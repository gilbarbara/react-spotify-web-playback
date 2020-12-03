import React, { useCallback, useRef, useState } from 'react';
import SpotifyWebPlayer, { STATUS, CallbackState } from 'react-spotify-web-playback';

import GitHubRepo from './GitHubRepo';
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
      <GitHubRepo />
    </div>
  );
};

export default App;
