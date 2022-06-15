import { FormEvent, MouseEvent, useCallback, useRef, useState } from 'react';
import SpotifyWebPlayer, { CallbackState, STATUS } from 'react-spotify-web-playback';
import {
  Anchor,
  Box,
  Button,
  ComponentWrapper,
  Container,
  Grid,
  H1,
  H4,
  H6,
  Icon,
  Input,
} from '@gilbarbara/components';

import { GlobalStyles, List, Player } from './components';
import GitHubRepo from './GitHubRepo';

const validateURI = (input: string): boolean => {
  let isValid = false;

  if (input && input.includes(':')) {
    const [key, type, id] = input.split(':');

    if (key && type && type !== 'user' && id && id.length === 22) {
      isValid = true;
    }
  }

  return isValid;
};

const parseURIs = (input: string): string[] => {
  const ids = input.split(',');

  return ids.every(d => validateURI(d)) ? ids : [];
};

function App() {
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

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      token: HTMLInputElement;
    };

    const nextToken = formElements.token.value;

    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem('rswp_token', nextToken);
      form.reset();
    }
  }, []);

  const handleSubmitURIs = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (URIsInput && URIsInput.current) {
      setURIs(parseURIs(URIsInput.current.value));
    }
  }, []);

  const handleClickURIs = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { uris = '' } = event.currentTarget.dataset;

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

  const content: any = {};

  if (token) {
    content.main = (
      <>
        <Box as="form" maxWidth={320} mx="auto" onSubmit={handleSubmitURIs} width="100%">
          <ComponentWrapper
            suffix={
              <Button
                shape="round"
                style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                type="submit"
              >
                <Icon name="check" size={24} />
              </Button>
            }
          >
            <Input
              ref={URIsInput}
              data-flex={1}
              defaultValue={URIs.join(',')}
              name="uris"
              placeholder="Enter a Spotify URI"
              suffixSpacing={48}
            />
          </ComponentWrapper>
        </Box>
        <Grid gap={20} maxWidth={320} mt="xl" mx="auto" templateColumns="repeat(2, 1fr)">
          <Button
            data-uris="spotify:artist:7A0awCXkE1FtSU8B0qwOJQ"
            onClick={handleClickURIs}
            size="sm"
          >
            Play an Artist
          </Button>
          <Button
            data-uris="spotify:album:51QBkcL7S3KYdXSSA0zM9R"
            onClick={handleClickURIs}
            size="sm"
          >
            Play an Album
          </Button>
          <Button
            data-uris="spotify:playlist:5kHMGRfZHORA4UrCbhYyad"
            onClick={handleClickURIs}
            size="sm"
          >
            Play a Playlist
          </Button>
          <Button
            data-uris={[
              'spotify:track:0gkVD2tr14wCfJhqhdE94L',
              'spotify:track:0E7S1k9M1KshLISVC2EP1M',
              'spotify:track:2WIUbg8CiAsKuQMw9DzZ1d',
              'spotify:track:2aJDlirz6v2a4HREki98cP',
              'spotify:track:6ap5AekhAt3k6e0zAknDyV',
              'spotify:track:6GNXHie8d6aN0rxFMnj2tx',
              'spotify:track:3C3VCp0ajmW9timvqBmiHf',
            ].join(',')}
            onClick={handleClickURIs}
            size="sm"
          >
            Play some Tracks
          </Button>
        </Grid>
      </>
    );
    content.player = (
      <Player key={token}>
        <SpotifyWebPlayer
          callback={handleCallback}
          initialVolume={50}
          persistDeviceSelection
          play={isPlaying}
          showSaveIcon
          styles={{
            sliderColor: '#1cb954',
          }}
          syncExternalDevice
          token={token}
          uris={URIs}
        />
      </Player>
    );
  } else {
    content.main = (
      <>
        <Box as="form" maxWidth={320} mx="auto" onSubmit={handleSubmit} width="100%">
          <ComponentWrapper
            suffix={
              <Button
                shape="round"
                style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                type="submit"
              >
                <Icon name="check" size={24} />
              </Button>
            }
          >
            <Input
              name="token"
              placeholder="Enter a Spotify token"
              suffixSpacing={48}
              type="text"
            />
          </ComponentWrapper>
        </Box>
        <Box mt="xl" textAlign="center">
          <H6>Required scopes</H6>
          <List>
            {scopes.map(d => (
              <li key={d}>{d}</li>
            ))}
          </List>
          <H4 mt="md">
            Get one{' '}
            <Anchor
              external
              href={`https://accounts.spotify.com/en/authorize?response_type=token&client_id=adaaf209fb064dfab873a71817029e0d&redirect_uri=https:%2F%2Fdeveloper.spotify.com%2Fdocumentation%2Fweb-playback-sdk%2Fquick-start%2F&scope=${scopes.join(
                '%20',
              )}&show_dialog=true`}
            >
              here
            </Anchor>
          </H4>
        </Box>
      </>
    );
  }

  return (
    <>
      <GlobalStyles hasToken={!!token} />
      <Container fullScreen fullScreenOffset={token ? 100 : 0} verticalAlign="center">
        <H1 align="center" mb="xl">
          React Spotify Web Playback
        </H1>

        {content.main}
        {content.player}

        <GitHubRepo />
      </Container>
    </>
  );
}

export default App;
