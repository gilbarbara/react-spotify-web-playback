import { memo, useEffect, useRef, useState } from 'react';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';
import SpotifyLogo from './SpotifyLogo';

import { getSpotifyLink, getSpotifyLinkTitle } from '../modules/getters';
import { usePrevious } from '../modules/hooks';
import { checkTracksStatus, removeTracks, saveTracks } from '../modules/spotify';
import { px, styled } from '../modules/styled';
import { Locale, SpotifyPlayerTrack, StyledProps, StylesOptions } from '../types';

interface Props {
  hideAttribution: boolean;
  isActive: boolean;
  locale: Locale;
  onFavoriteStatusChange: (status: boolean) => any;
  showSaveIcon: boolean;
  styles: StylesOptions;
  token: string;
  track: SpotifyPlayerTrack;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
}

const imageSize = 64;
const iconSize = 42;

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    height: px(imageSize),
    textAlign: 'left',

    a: {
      display: 'inline-flex',
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    },

    img: {
      height: px(imageSize),
      width: px(imageSize),
    },

    button: {
      alignItems: 'center',
      display: 'flex',
      fontSize: px(16),
      height: px(iconSize),
      justifyContent: 'center',
      width: px(iconSize),
    },

    '@media (max-width: 767px)': {
      borderBottom: '1px solid #ccc',
      paddingLeft: px(8),
      display: 'none',
      width: '100%',
    },

    '&.rswp__active': {
      '@media (max-width: 767px)': {
        display: 'flex',
      },
    },
  },
  ({ style }: StyledProps) => ({
    height: px(style.h),

    button: {
      color: style.c,

      '&.rswp__active': {
        color: style.activeColor,
      },
    },
  }),
  'InfoRSWP',
);

const Title = styled('div')(
  {
    display: 'flex',
    flexDirection: 'column',
    height: px(imageSize),
    justifyContent: 'center',
    paddingLeft: px(8),
    whiteSpace: 'nowrap',

    p: {
      fontSize: px(14),
      lineHeight: 1.3,
      maxWidth: '100%',
      paddingRight: px(5),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',

      '&:nth-of-type(1)': {
        alignItems: 'center',
        display: 'inline-flex',
      },

      '&:nth-of-type(2)': {
        fontSize: px(12),
      },
    },

    '> a': {
      color: 'inherit',
      fontSize: px(22),
      marginTop: 'auto',
    },

    span: {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  ({ style }: StyledProps) => ({
    maxWidth: `calc(100% - ${px(style.showSaveIcon ? imageSize + iconSize : imageSize)})`,

    '@media (min-width: 768px)': {
      maxWidth: `calc(100% - ${px(style.showSaveIcon ? imageSize + iconSize : imageSize)})`,
    },

    p: {
      a: {
        color: style.trackNameColor,
      },

      '&:nth-of-type(2)': {
        a: {
          color: style.trackArtistColor,
        },
      },
    },
  }),
);

function Info(props: Props) {
  const {
    hideAttribution,
    isActive,
    locale,
    onFavoriteStatusChange,
    showSaveIcon,
    styles: { activeColor, bgColor, color, height, trackArtistColor, trackNameColor },
    token,
    track: { artists = [], id, name, thumb, uri },
    updateSavedStatus,
  } = props;
  const [isSaved, setIsSaved] = useState(false);
  const isMounted = useRef(false);
  const previousId = usePrevious(id);

  const updateState = (state: boolean) => {
    if (!isMounted.current) {
      return;
    }

    setIsSaved(state);
  };

  const setStatus = async () => {
    if (!isMounted.current) {
      return;
    }

    if (updateSavedStatus && id) {
      updateSavedStatus((newStatus: boolean) => {
        updateState(newStatus);
      });
    }

    const status = await checkTracksStatus(token, id);
    const [isFavorite] = status || [false];

    updateState(isFavorite);
    onFavoriteStatusChange(isSaved);
  };

  useEffect(() => {
    isMounted.current = true;

    if (showSaveIcon && id) {
      setStatus();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (showSaveIcon && previousId !== id && id) {
      updateState(false);

      setStatus();
    }
  });

  const handleClickIcon = async () => {
    if (isSaved) {
      await removeTracks(token, id);
      updateState(false);
    } else {
      await saveTracks(token, id);
      updateState(true);
    }

    onFavoriteStatusChange(!isSaved);
  };

  const title = getSpotifyLinkTitle(name, locale.title);
  let favorite;

  /* istanbul ignore else */
  if (showSaveIcon && id) {
    favorite = (
      <button
        aria-label={isSaved ? locale.removeTrack : locale.saveTrack}
        className={isSaved ? 'rswp__active' : undefined}
        onClick={handleClickIcon}
        title={isSaved ? locale.removeTrack : locale.saveTrack}
        type="button"
      >
        {isSaved ? <Favorite /> : <FavoriteOutline />}
      </button>
    );
  }

  const classes = [];

  if (isActive) {
    classes.push('rswp__active');
  }

  return (
    <Wrapper
      className={classes.join(' ')}
      data-component-name="Info"
      style={{
        activeColor,
        c: color,
        h: height,
        showSaveIcon,
      }}
    >
      {thumb && (
        <a
          aria-label={title}
          href={getSpotifyLink(uri)}
          rel="noreferrer"
          target="_blank"
          title={title}
        >
          <img alt={name} src={thumb} />
        </a>
      )}
      {!!name && (
        <Title
          style={{
            showSaveIcon,
            trackArtistColor,
            trackNameColor,
          }}
        >
          <p>
            <span>
              <a
                aria-label={title}
                href={getSpotifyLink(uri)}
                rel="noreferrer"
                target="_blank"
                title={title}
              >
                {name}
              </a>
            </span>
          </p>
          <p title={artists.map(d => d.name).join(', ')}>
            {artists.map((artist, index) => {
              const artistTitle = getSpotifyLinkTitle(artist.name, locale.title);

              return (
                <span key={artist.uri}>
                  {index ? ', ' : ''}
                  <a
                    aria-label={artistTitle}
                    href={getSpotifyLink(artist.uri)}
                    rel="noreferrer"
                    target="_blank"
                    title={artistTitle}
                  >
                    {artist.name}
                  </a>
                </span>
              );
            })}
          </p>
          {!hideAttribution && (
            <a
              aria-label="Play on Spotify"
              href={getSpotifyLink(uri)}
              rel="noreferrer"
              target="_blank"
            >
              <SpotifyLogo bgColor={bgColor} />
            </a>
          )}
        </Title>
      )}
      {favorite}
    </Wrapper>
  );
}

export default memo(Info);
