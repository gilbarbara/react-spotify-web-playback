import { useEffect, useRef, useState } from 'react';
import { useMount, usePrevious, useUnmount } from 'react-use';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';

import { checkTracksStatus, removeTracks, saveTracks } from '../spotify';
import { px, styled } from '../styles';
import { Locale, StyledProps, StylesOptions } from '../types/common';
import { SpotifyPlayerTrack } from '../types/spotify';
import { getSpotifyLink, getSpotifyLinkTitle } from '../utils';

interface Props {
  isActive: boolean;
  locale: Locale;
  onFavoriteStatusChange: (status: boolean) => any;
  showSaveIcon: boolean;
  styles: StylesOptions;
  token: string;
  track: SpotifyPlayerTrack;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
}

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    textAlign: 'left',

    a: {
      display: 'inline-flex',
      textDecoration: 'none',
    },

    '@media (max-width: 1023px)': {
      borderBottom: '1px solid #ccc',
      display: 'none',
      width: '100%',
    },

    '&.rswp__active': {
      '@media (max-width: 1023px)': {
        display: 'flex',
      },
    },
  },
  ({ style }: StyledProps) => ({
    height: px(style.h),

    img: {
      height: px(style.h),
      width: px(style.h),
    },
  }),
  'InfoRSWP',
);

const Title = styled('div')(
  {
    paddingLeft: px(10),
    whiteSpace: 'nowrap',

    p: {
      fontSize: px(14),
      lineHeight: 1.3,
      paddingRight: px(5),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',

      '&:first-child': {
        alignItems: 'center',
        display: 'inline-flex',
      },
    },

    span: {
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    button: {
      fontSize: '110%',
      marginLeft: px(5),
    },
  },
  ({ style }: StyledProps) => ({
    width: `calc(100% - ${px(style.h)})`,

    p: {
      a: {
        color: style.trackNameColor,
      },

      '&:last-child': {
        a: {
          color: style.trackArtistColor,
        },
      },
    },

    button: {
      color: style.c,

      '&.rswp__active': {
        color: style.activeColor,
      },
    },
  }),
);

export default function Info(props: Props) {
  const {
    isActive,
    locale,
    onFavoriteStatusChange,
    showSaveIcon,
    styles: { activeColor, color, height, trackArtistColor, trackNameColor },
    token,
    track: { id, name, uri, image, artists = [] },
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

  useMount(async () => {
    isMounted.current = true;

    if (showSaveIcon && id) {
      await setStatus();
    }
  });

  useEffect(() => {
    if (showSaveIcon && previousId !== id && id) {
      updateState(false);

      setStatus();
    }
  });

  useUnmount(() => {
    isMounted.current = false;
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
  let icon;

  /* istanbul ignore else */
  if (showSaveIcon && id) {
    icon = (
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
    <Wrapper className={classes.join(' ')} data-component-name="Info" style={{ h: height }}>
      {image && (
        <a
          aria-label={title}
          href={getSpotifyLink(uri)}
          rel="noreferrer"
          target="_blank"
          title={title}
        >
          <img alt={name} src={image} />
        </a>
      )}
      {!!name && (
        <Title style={{ c: color, h: height, activeColor, trackArtistColor, trackNameColor }}>
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
            {icon}
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
        </Title>
      )}
    </Wrapper>
  );
}
