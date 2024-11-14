import { FormEvent, MouseEvent, ReactNode, useCallback, useRef } from 'react';
import SpotifyWebPlayer, {
  CallbackState,
  ERROR_TYPE,
  Layout,
  RepeatState,
  SpotifyPlayer,
  STATUS,
  StylesProps,
  TYPE,
  Type,
} from 'react-spotify-web-playback';
import {
  Anchor,
  Box,
  Button,
  Container,
  Flex,
  FormElementWrapper,
  Grid,
  H1,
  H4,
  Icon,
  Input,
  Loader,
  NonIdealState,
  RadioGroup,
  Spacer,
  Toggle,
} from '@gilbarbara/components';
import { request } from '@gilbarbara/helpers';
import { useEffectOnce, useSetState } from '@gilbarbara/hooks';

import GlobalStyles from './components/GlobalStyles';
import Player from './components/Player';
import RepeatButton from './components/RepeatButton';
import ShuffleButton from './components/ShuffleButton';
import {
  getAuthorizeUrl,
  getCredentials,
  login,
  logout,
  parseURIs,
  refreshCredentials,
  setCredentials,
} from './modules/helpers';

interface State {
  URIs: string[];
  accessToken: string;
  error?: string;
  hideAttribution: boolean;
  inlineVolume: boolean;
  isActive: boolean;
  isPlaying: boolean;
  layout: 'responsive' | 'compact';
  player: SpotifyPlayer;
  refreshToken: string;
  repeat: RepeatState;
  shuffle: boolean;
  styles?: StylesProps;
  transparent: boolean;
}

const baseURIs = {
  album: 'spotify:album:0WLIcGHr0nLyKJpMirAS17',
  artist: 'spotify:artist:4oLeXFyACqeem2VImYeBFe',
  playlist: 'spotify:playlist:1Zr2FUPeD5hYJTGbTDSQs4',
  show: 'spotify:show:4kYCRYJ3yK5DQbP5tbfZby',
  tracks: [
    // Boogie
    // 'spotify:track:3zYpRGnnoegSpt3SguSo3W',
    // 'spotify:track:5sjeJXROHuutyj8P3JGZoN',
    // 'spotify:track:3u0VPnYkZo30zw60SInouA',
    // 'spotify:track:5ZoDwIP1ntHwciLjydJ8X2',
    // 'spotify:track:7ohR0qPH6f2Vuj2pUNanJG',
    // 'spotify:track:5g2sPpVq3hdk9ZuMfABrts',
    // 'spotify:track:3mJ6pNcFM2CkykCYSREdKT',
    // 'spotify:track:63DTXKZi7YdJ4tzGti1Dtr',

    // 90s Electronic
    'spotify:track:5Kh3pqvJGVCBapAgrRP8QO',
    'spotify:track:0j5FJJOmmnXPd0XajFWkMF',
    'spotify:track:3XWgwgbWDI56mf1Wl3cLzb',
    'spotify:track:6rvinglzwGWPaO9N9nnHeR',
    'spotify:track:6LERtd1yiclxFH8MHAqr0Q',
    'spotify:track:5eFCFpmDbqGqpdOVE9CXCh',
    'spotify:track:1RdHfWJogQm1UW4MglA8gA',
    'spotify:track:3z70bimZB3dgdixBrxpxY0',
    'spotify:track:3RmCwMliRzxvjGp42ItZtC',
    'spotify:track:6WpTrVTG1mFU1hZpxbVBX7',
    'spotify:track:5sJiLlgQKBL81QCTOkoLB5',
    'spotify:track:7hnqJYCKZFW7vMoykaraZG',
  ],
};

function App() {
  const URIsInput = useRef<HTMLInputElement>(null);
  const isMounted = useRef(false);

  const code = new URLSearchParams(window.location.search).get('code');
  const credentials = getCredentials();

  const [
    {
      accessToken,
      error,
      hideAttribution,
      inlineVolume,
      isActive,
      isPlaying,
      layout,
      refreshToken,
      repeat,
      shuffle,
      styles,
      transparent,
      URIs,
    },
    setState,
  ] = useSetState<State>({
    accessToken: credentials.accessToken ?? '',
    hideAttribution: false,
    inlineVolume: true,
    isActive: false,
    isPlaying: false,
    layout: 'responsive',
    player: null,
    refreshToken: credentials.refreshToken ?? '',
    repeat: 'off',
    shuffle: false,
    styles: undefined,
    transparent: false,
    URIs: [baseURIs.artist],
  });

  useEffectOnce(() => {
    if (code && !isMounted.current) {
      login(code)
        .then(spotifyCredentials => {
          setCredentials(spotifyCredentials);
          setState({
            accessToken: spotifyCredentials.accessToken,
            refreshToken: spotifyCredentials.refreshToken,
          });
        })
        .catch(fetchError => {
          setState({ error: fetchError.message || 'An error occurred. Try again' });
        })
        .finally(() => {
          const url = new URL(window.location.href);

          window.history.replaceState({}, document.title, `${url.pathname}`);
        });
    }

    return () => {
      isMounted.current = true;
    };
  });

  const handleSubmitURIs = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (URIsInput?.current) {
        setState({ URIs: parseURIs(URIsInput.current.value) });
      }
    },
    [setState],
  );

  const handleClickLogout = useCallback(() => {
    logout();
    setState({ accessToken: '', refreshToken: '' });
  }, [setState]);

  const handleClickURIs = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const { uris = '' } = event.currentTarget.dataset;

      setState({ isPlaying: true, URIs: parseURIs(uris) });

      if (URIsInput?.current) {
        URIsInput.current.value = uris;
      }
    },
    [setState],
  );

  const handleCallback = useCallback(
    async ({ track, type, ...state }: CallbackState) => {
      /* eslint-disable no-console */
      console.group(`RSWP: ${type}`);
      console.log(state);
      console.groupEnd();
      /* eslint-enable no-console */

      if (type === TYPE.PLAYER) {
        setState({
          isActive: state.isActive,
          isPlaying: state.isPlaying,
          repeat: state.repeat,
          shuffle: state.shuffle,
        });
      }

      if (([TYPE.PRELOAD, TYPE.TRACK] as Array<Type>).includes(type)) {
        const trackStyles = await request<StylesProps>(
          `https://scripts.gilbarbara.dev/api/getImagePlayerStyles?url=${track.image}`,
        );

        if (transparent) {
          trackStyles.bgColor = 'transparent';
        }

        setState({ styles: trackStyles });
      }

      if (state.status === STATUS.ERROR && state.errorType === ERROR_TYPE.AUTHENTICATION) {
        refreshCredentials(refreshToken)
          .then(spotifyCredentials => {
            setCredentials(spotifyCredentials);
            setState({ accessToken: spotifyCredentials.accessToken });
          })
          .catch(() => {
            logout();
            setState({ accessToken: '', refreshToken: '' });
          });
      }
    },
    [refreshToken, setState, transparent],
  );

  const getPlayer = useCallback(
    async (playerInstance: SpotifyPlayer) => {
      setState({ player: playerInstance });
    },
    [setState],
  );

  const content: Record<string, ReactNode> = {
    connect: (
      <Flex justify="center" maxWidth={320} mx="auto" width="100%">
        <Anchor href={getAuthorizeUrl()}>
          <Button size="lg">
            <Icon mr="sm" name="spotify" size={24} />
            <span>Connect</span>
          </Button>
        </Anchor>
      </Flex>
    ),
  };

  if (error) {
    content.main = (
      <>
        <NonIdealState description={error} icon="close-o" mb="lg" title={null} />
        {content.connect}
      </>
    );
  } else if (code) {
    content.main = <Loader size={200} />;
  } else if (accessToken) {
    content.main = (
      <>
        <Box as="form" maxWidth={320} mx="auto" onSubmit={handleSubmitURIs} width="100%">
          <FormElementWrapper
            endContent={
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
          </FormElementWrapper>
        </Box>
        <Grid gap={20} maxWidth={320} mt="xl" mx="auto" templateColumns="repeat(2, 1fr)">
          <Button data-uris={baseURIs.artist} onClick={handleClickURIs} size="sm">
            Play an Artist
          </Button>
          <Button data-uris={baseURIs.album} onClick={handleClickURIs} size="sm">
            Play an Album
          </Button>
          <Button data-uris={baseURIs.playlist} onClick={handleClickURIs} size="sm">
            Play a Playlist
          </Button>
          <Button data-uris={baseURIs.tracks.join(',')} onClick={handleClickURIs} size="sm">
            Play some Tracks
          </Button>
        </Grid>
        <Box maxWidth={400} mt="xl" mx="auto" textAlign="center">
          <H4>Layout</H4>
          <RadioGroup
            inline
            items={[
              { label: 'Responsive', value: 'responsive' },
              {
                label: 'Compact',
                value: 'compact',
              },
            ]}
            name="layout"
            onChange={item => setState({ layout: item.currentTarget.value as Layout })}
            style={{ justifyContent: 'center' }}
            value={layout}
          />
          <H4 mt="md">Props</H4>
          <Spacer distribution="center" gap="md" mx="auto">
            <Toggle
              checked={hideAttribution}
              label="Hide Attribution"
              name="hideAttribution"
              onToggle={() => setState({ hideAttribution: !hideAttribution })}
            />
            <Toggle
              checked={inlineVolume}
              label="Inline Volume"
              name="inlineVolume"
              onToggle={() => setState({ inlineVolume: !inlineVolume })}
            />
            <Toggle
              checked={transparent}
              label="Transparent"
              name="transparent"
              onToggle={() => setState({ transparent: !transparent })}
            />
          </Spacer>
        </Box>
      </>
    );

    content.player = (
      <Player key={accessToken} layout={layout}>
        <SpotifyWebPlayer
          callback={handleCallback}
          components={{
            leftButton: (
              <ShuffleButton disabled={!isActive} shuffle={shuffle} token={accessToken} />
            ),
            rightButton: <RepeatButton disabled={!isActive} repeat={repeat} token={accessToken} />,
          }}
          getOAuthToken={async callback => {
            if ((credentials.expiresAt ?? 0) < Math.round(Date.now() / 1000)) {
              const newCredentials = await refreshCredentials(refreshToken);

              setCredentials(newCredentials);
              setState({
                accessToken: newCredentials.accessToken,
                refreshToken: newCredentials.refreshToken,
              });

              callback(newCredentials.accessToken);
            } else {
              callback(accessToken);
            }
          }}
          getPlayer={getPlayer}
          hideAttribution={hideAttribution}
          initialVolume={100}
          inlineVolume={inlineVolume}
          layout={layout}
          persistDeviceSelection
          play={isPlaying}
          preloadData
          showSaveIcon
          styles={transparent ? { ...styles, bgColor: 'transparent' } : styles}
          syncExternalDevice
          token={accessToken}
          uris={URIs}
        />
      </Player>
    );
  } else {
    content.main = content.connect;
  }

  return (
    <>
      <GlobalStyles hasToken={!!accessToken} />
      <Container fullScreen fullScreenOffset={accessToken ? 100 : 0} justify="center">
        <Spacer distribution="center" mb="xl">
          <H1 align="center" mb={0}>
            React Spotify Web Playback
          </H1>

          {accessToken && (
            <Button onClick={handleClickLogout} size="xs">
              <Icon name="sign-out" size={14} />
            </Button>
          )}
        </Spacer>

        {content.main}
        {content.player}
      </Container>
    </>
  );
}

export default App;
