import {
  DragEventHandler,
  FormEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
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
  ButtonGroup,
  ButtonUnstyled,
  Container,
  Flex,
  FormElementWrapper,
  H1,
  H4,
  Icon,
  Input,
  Loader,
  NonIdealState,
  Paragraph,
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
  accessToken: string;
  error?: string;
  hideAttribution: boolean;
  inlineVolume: boolean;
  isActive: boolean;
  isPlaying: boolean;
  layout: 'responsive' | 'compact';
  player: SpotifyPlayer | null;
  refreshToken: string;
  repeat: RepeatState;
  shuffle: boolean;
  styles?: StylesProps;
  transparent: boolean;
  URIs: string[];
}

const baseURIs = {
  // album: 'spotify:album:0WLIcGHr0nLyKJpMirAS17', // The Breathing Effect - Mars Is A Very Bad Place For Love
  album: 'spotify:album:4c7fP0tUymaZcrEFIeIeZc', // Caribou - Honey
  // artist: 'spotify:artist:4oLeXFyACqeem2VImYeBFe', // Fred Again..
  artist: 'spotify:artist:7A0awCXkE1FtSU8B0qwOJQ', // Jamie xx
  // playlist: 'spotify:playlist:1Zr2FUPeD5hYJTGbTDSQs4', // Rework
  playlist: 'spotify:playlist:3h7lEfRkEdtVvGJTdTAudn', // Nation
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
    // 'spotify:track:5Kh3pqvJGVCBapAgrRP8QO',
    // 'spotify:track:0j5FJJOmmnXPd0XajFWkMF',
    // 'spotify:track:3XWgwgbWDI56mf1Wl3cLzb',
    // 'spotify:track:6rvinglzwGWPaO9N9nnHeR',
    // 'spotify:track:6LERtd1yiclxFH8MHAqr0Q',
    // 'spotify:track:5eFCFpmDbqGqpdOVE9CXCh',
    // 'spotify:track:1RdHfWJogQm1UW4MglA8gA',
    // 'spotify:track:3z70bimZB3dgdixBrxpxY0',
    // 'spotify:track:3RmCwMliRzxvjGp42ItZtC',
    // 'spotify:track:6WpTrVTG1mFU1hZpxbVBX7',
    // 'spotify:track:5sJiLlgQKBL81QCTOkoLB5',
    // 'spotify:track:7hnqJYCKZFW7vMoykaraZG',

    // Dance Punk
    'spotify:track:305CEVdhAViS0CW2NCLvdR',
    'spotify:track:1XlDNpWy8dyEljyRd0RC2J',
    'spotify:track:1Jd9W7k8DTnBSovDSxK77n',
    'spotify:track:7ddGC67DasWO30q5YepUJe',
    'spotify:track:3yRV0V5l87Q6EyEnv3d7YJ',
    'spotify:track:7pskYSHhRTH1TFtVdQevG5',
    'spotify:track:3RCj5fG55qjtmnEML1gpnA',
    'spotify:track:6b9oxWgxekphG5vkz8ZpBt',
    'spotify:track:29wCKit7yf8ipSCViR7cGd',
    'spotify:track:0Nua2OtL0ygR9HrY50ptQX',
    'spotify:track:2Yx9fXTpx1cxL6m4cMq9AO',
    'spotify:track:4d2sFYYGe1vQ65IXwm6mNt',
  ],
};

function App() {
  const URIsInput = useRef<HTMLInputElement>(null);
  const isMounted = useRef(false);
  const playerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.querySelector('a')?.setAttribute('draggable', `${layout === 'responsive'}`);
    playerRef
      .current.querySelector('img')
      ?.setAttribute('draggable', `${layout === 'responsive'}`);

    if (layout === 'responsive') {
      playerRef.current.style.left = '0';
      playerRef.current.style.right = '0';
      playerRef.current.style.bottom = '0';
      playerRef.current.style.top = 'auto';
    } else {
      playerRef.current.style.left = 'auto';
      playerRef.current.style.right = '20px';
      playerRef.current.style.bottom = '20px';
      playerRef.current.style.top = 'auto';
    }
  }, [layout]);

  useEffect(() => {
    const dragOver = (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer) {
        return;
      }

      event.dataTransfer.dropEffect = 'move';
    };

    const drop = (event: DragEvent) => {
      event.preventDefault();
      const offsetData = event.dataTransfer?.getData('offset');

      if (!offsetData) {
        return;
      }

      const offset = JSON.parse(offsetData);
      const xPos = event.clientX - offset.x;
      const yPos = event.clientY - offset.y;

      if (playerRef.current) {
        playerRef.current.style.left = `${xPos}px`;
        playerRef.current.style.top = `${yPos}px`;
        playerRef.current.style.bottom = 'auto';
        playerRef.current.style.right = 'auto';
      }
    };

    document.documentElement.addEventListener('dragover', dragOver);
    document.documentElement.addEventListener('drop', drop);

    return () => {
      document.documentElement.removeEventListener('dragover', dragOver);
      document.documentElement.removeEventListener('drop', drop);
    };
  }, []);

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

  const handlePlayerDrag: DragEventHandler<HTMLDivElement> = useCallback(
    event => {
      if (layout === 'responsive') {
        return;
      }

      const boundingRect = playerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const offset = {
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top,
      };

      event.dataTransfer.setData('offset', JSON.stringify(offset));
    },
    [layout],
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

  const getButtonStyle = (input: string) => {
    return URIs.join(',') === input ? 'primary.300' : 'primary';
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
        <Box as="form" maxWidth={480} mx="auto" onSubmit={handleSubmitURIs} width="100%">
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
        <Flex basis="50%" gap="md" justify="center" maxWidth={480} mt="xl" mx="auto" wrap="wrap">
          <Box textAlign="center">
            <Button
              bg={getButtonStyle(baseURIs.artist)}
              data-uris={baseURIs.artist}
              onClick={handleClickURIs}
              size="sm"
            >
              Play an Artist
            </Button>
            <Paragraph mt="xxxs">
              <Anchor
                color={getButtonStyle(baseURIs.artist)}
                external
                href="https://open.spotify.com/artist/7A0awCXkE1FtSU8B0qwOJQ?si=IP6f4hiVQ2Gk8XyepAhD0Q"
              >
                Jamie xx
              </Anchor>
            </Paragraph>
          </Box>
          <Box textAlign="center">
            <Button
              bg={getButtonStyle(baseURIs.album)}
              data-uris={baseURIs.album}
              onClick={handleClickURIs}
              size="sm"
            >
              Play an Album
            </Button>
            <Paragraph mt="xxxs">
              <Anchor
                color={getButtonStyle(baseURIs.album)}
                external
                href="https://open.spotify.com/album/4c7fP0tUymaZcrEFIeIeZc?si=GarHO227QGuyfteTlpMSzA"
              >
                Caribou - Honey
              </Anchor>
            </Paragraph>
          </Box>
          <Box textAlign="center">
            <Button
              bg={getButtonStyle(baseURIs.playlist)}
              data-uris={baseURIs.playlist}
              onClick={handleClickURIs}
              size="sm"
            >
              Play a Playlist
            </Button>
            <Paragraph mt="xxxs">
              <Anchor
                color={getButtonStyle(baseURIs.playlist)}
                external
                href="https://open.spotify.com/playlist/3h7lEfRkEdtVvGJTdTAudn?si=8294ef57c54d4fa8"
              >
                Nation
              </Anchor>
            </Paragraph>
          </Box>
          <Box textAlign="center">
            <Button
              bg={getButtonStyle(baseURIs.tracks.join(','))}
              data-uris={baseURIs.tracks.join(',')}
              onClick={handleClickURIs}
              size="sm"
            >
              Play some Tracks
            </Button>
            <Paragraph mt="xxxs">Dance Punk</Paragraph>
          </Box>
          <Box textAlign="center">
            <Button
              bg={getButtonStyle(baseURIs.show)}
              data-uris={baseURIs.show}
              onClick={handleClickURIs}
              size="sm"
            >
              Play a Show
            </Button>
            <Paragraph mt="xxxs">
              <Anchor
                color={getButtonStyle(baseURIs.show)}
                external
                href="https://open.spotify.com/show/4kYCRYJ3yK5DQbP5tbfZby"
              >
                Syntax
              </Anchor>
            </Paragraph>
          </Box>
        </Flex>
        <Flex gap="xl" justify="space-between" maxWidth={400} mt="xl" mx="auto" width="100%">
          <Box>
            <H4>Layout</H4>
            <ButtonGroup
              items={[{ label: 'responsive' }, { label: 'compact' }]}
              onClick={event => setState({ layout: event.currentTarget.textContent as Layout })}
              selected={layout}
              size="sm"
            />
          </Box>
          <Box>
            <H4>Props</H4>
            <Flex direction="column" gap="md" mx="auto" wrap="wrap">
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
                onToggle={value => setState({ transparent: value })}
              />
            </Flex>
          </Box>
        </Flex>
      </>
    );

    content.player = (
      <Player
        key={accessToken}
        ref={playerRef}
        draggable={layout === 'compact'}
        layout={layout}
        onDragStart={handlePlayerDrag}
      >
        {layout === 'compact' && (
          <ButtonUnstyled bg="white" opacity={0.8} radius="xxs">
            <Icon name="maximize-alt" size={20} />
          </ButtonUnstyled>
        )}
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
