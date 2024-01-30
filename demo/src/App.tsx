import { FormEvent, MouseEvent, useCallback, useRef } from 'react';
import SpotifyWebPlayer, {
  CallbackState,
  ERROR_TYPE,
  Layout,
  RepeatState,
  SpotifyPlayer,
  STATUS,
  StylesProps,
  TYPE,
} from 'react-spotify-web-playback';
import { useSetState } from 'react-use';
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
  RadioGroup,
  Spacer,
  Toggle,
} from '@gilbarbara/components';
import { request } from '@gilbarbara/helpers';

import { GlobalStyles, List, Player, RepeatButton, ShuffleButton } from './components';

interface State {
  URIs: string[];
  hideAttribution: boolean;
  inlineVolume: boolean;
  isActive: boolean;
  isPlaying: boolean;
  layout: 'responsive' | 'compact';
  player: SpotifyPlayer;
  repeat: RepeatState;
  shuffle: boolean;
  styles?: StylesProps;
  token: string;
  transparent: boolean;
}

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

const baseURIs = {
  album: 'spotify:album:5GzhTq1Iu7jioZquau8f93',
  artist: 'spotify:artist:4oLeXFyACqeem2VImYeBFe',
  playlist: 'spotify:playlist:5BxDl4F4ZSgackA0YVV3ca',
  tracks: [
    'spotify:track:3zYpRGnnoegSpt3SguSo3W',
    'spotify:track:5sjeJXROHuutyj8P3JGZoN',
    'spotify:track:3u0VPnYkZo30zw60SInouA',
    'spotify:track:5ZoDwIP1ntHwciLjydJ8X2',
    'spotify:track:7ohR0qPH6f2Vuj2pUNanJG',
    'spotify:track:5g2sPpVq3hdk9ZuMfABrts',
    'spotify:track:3mJ6pNcFM2CkykCYSREdKT',
    'spotify:track:63DTXKZi7YdJ4tzGti1Dtr',
  ],
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
  const [
    {
      hideAttribution,
      inlineVolume,
      isActive,
      isPlaying,
      layout,
      repeat,
      shuffle,
      styles,
      token,
      transparent,
      URIs,
    },
    setState,
  ] = useSetState<State>({
    hideAttribution: false,
    inlineVolume: true,
    isActive: false,
    isPlaying: false,
    layout: 'responsive',
    player: null,
    repeat: 'off',
    shuffle: false,
    styles: undefined,
    token: savedToken || '',
    transparent: false,
    URIs: [baseURIs.artist],
  });

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const form = event.currentTarget as HTMLFormElement;
      const formElements = form.elements as typeof form.elements & {
        token: HTMLInputElement;
      };

      const nextToken = formElements.token.value;

      if (nextToken) {
        setState({ token: nextToken });
        localStorage.setItem('rswp_token', nextToken);
        form.reset();
      }
    },
    [setState],
  );

  const handleSubmitURIs = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (URIsInput && URIsInput.current) {
        setState({ URIs: parseURIs(URIsInput.current.value) });
      }
    },
    [setState],
  );

  const handleClickURIs = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const { uris = '' } = event.currentTarget.dataset;

      setState({ isPlaying: true, URIs: parseURIs(uris) });

      if (URIsInput && URIsInput.current) {
        URIsInput.current.value = uris;
      }
    },
    [setState],
  );

  const handleCallback = useCallback(
    async ({ track, type, ...state }: CallbackState) => {
      console.group(`RSWP: ${type}`);
      console.log(state);
      console.groupEnd();

      if (type === TYPE.PLAYER) {
        setState({
          isActive: state.isActive,
          isPlaying: state.isPlaying,
          repeat: state.repeat,
          shuffle: state.shuffle,
        });
      }

      if (type === TYPE.TRACK) {
        const trackStyles = await request<StylesProps>(
          `https://scripts.gilbarbara.dev/api/getImagePlayerStyles?url=${track.image}`,
        );

        if (transparent) {
          trackStyles.bgColor = 'transparent';
        }

        setState({ styles: trackStyles });
      }

      if (state.status === STATUS.ERROR && state.errorType === ERROR_TYPE.AUTHENTICATION) {
        localStorage.removeItem('rswp_token');
        setState({ token: '' });
      }
    },
    [setState, transparent],
  );

  const getPlayer = useCallback(
    async (playerInstance: SpotifyPlayer) => {
      setState({ player: playerInstance });
    },
    [setState],
  );

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
          <Spacer distribution="center" gapVertical="md" mx="auto">
            <Toggle
              checked={hideAttribution}
              label="Hide Attribution"
              name="hideAttribution"
              onClick={() => setState({ hideAttribution: !hideAttribution })}
            />
            <Toggle
              checked={inlineVolume}
              label="Inline Volume"
              name="inlineVolume"
              onClick={() => setState({ inlineVolume: !inlineVolume })}
            />
            <Toggle
              checked={transparent}
              label="Transparent"
              name="transparent"
              onClick={() => setState({ transparent: !transparent })}
            />
          </Spacer>
        </Box>
      </>
    );

    content.player = (
      <Player key={token} layout={layout}>
        <SpotifyWebPlayer
          callback={handleCallback}
          components={{
            leftButton: <ShuffleButton disabled={!isActive} shuffle={shuffle} token={token} />,
            rightButton: <RepeatButton disabled={!isActive} repeat={repeat} token={token} />,
          }}
          getPlayer={getPlayer}
          hideAttribution={hideAttribution}
          initialVolume={100}
          inlineVolume={inlineVolume}
          layout={layout}
          persistDeviceSelection
          play={isPlaying}
          showSaveIcon
          styles={transparent ? { ...styles, bgColor: 'transparent' } : styles}
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
              href={`https://accounts.spotify.com/en/authorize?response_type=token&client_id=2030beede5174f9f9b23ffc23ba0705c&redirect_uri=https:%2F%2Freact-spotify-web-playback.gilbarbara.dev%2Ftoken.html&scope=${scopes.join(
                '%20',
              )}&show_dialog=false`}
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
      <Container fullScreen fullScreenOffset={token ? 100 : 0} justify="center">
        <H1 align="center" mb="xl">
          React Spotify Web Playback
        </H1>

        {content.main}
        {content.player}
      </Container>
    </>
  );
}

export default App;
