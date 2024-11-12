import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { opacify } from 'colorizr';

import { getBgColor, getSpotifyLink, getSpotifyLinkTitle } from '~/modules/getters';
import { usePrevious } from '~/modules/hooks';
import { checkTracksStatus, removeTracks, saveTracks } from '~/modules/spotify';
import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, Locale, SpotifyTrack, StyledProps, StylesOptions } from '~/types';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';
import SpotifyLogo from './SpotifyLogo';

interface Props {
  hideAttribution: boolean;
  hideCoverArt: boolean;
  isActive: boolean;
  layout: Layout;
  locale: Locale;
  onFavoriteStatusChange: (status: boolean) => any;
  showSaveIcon: boolean;
  styles: StylesOptions;
  token: string;
  track: SpotifyTrack;
  updateSavedStatus?: (fn: (status: boolean) => any) => any;
}

const imageSize = 64;
const iconSize = 32;

const Wrapper = styled('div')(
  {
    textAlign: 'left',

    '> a': {
      display: 'inline-flex',
      textDecoration: 'none',
      minHeight: px(64),
      minWidth: px(64),

      '&:hover': {
        textDecoration: 'underline',
      },
    },

    button: {
      alignItems: 'center',
      display: 'flex',
      fontSize: px(16),
      height: px(iconSize + 8),
      justifyContent: 'center',
      width: px(iconSize),
    },
  },
  ({ style }: StyledProps) => {
    const isCompactLayout = style.layout === 'compact';
    const styles: CssLikeObject = {};

    if (isCompactLayout) {
      styles.borderBottom = `1px solid ${opacify(style.c, 0.6)}`;
      styles['> a'] = {
        display: 'flex',
        margin: '0 auto',
        maxWidth: px(640),
        paddingBottom: '100%',
        position: 'relative',

        img: {
          display: 'block',
          bottom: 0,
          left: 0,
          maxWidth: '100%',
          position: 'absolute',
          right: 0,
          top: 0,
        },
      };
    } else {
      styles.alignItems = 'center';
      styles.display = 'flex';
      styles.minHeight = px(80);
      styles['@media (max-width: 767px)'] = {
        borderBottom: `1px solid ${opacify(style.c, 0.6)}`,
        paddingLeft: px(8),
        display: 'none',
        width: '100%',
      };
      styles.img = {
        height: px(imageSize),
        width: px(imageSize),
      };
      styles['&.rswp__active'] = {
        '@media (max-width: 767px)': {
          display: 'flex',
        },
      };
    }

    return {
      button: {
        color: style.c,

        '&.rswp__active': {
          color: style.activeColor,
        },
      },

      ...styles,
    };
  },
  'InfoRSWP',
);

const ContentWrapper = styled('div')(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '> a': {
      fontSize: px(22),
      marginTop: px(4),
    },
  },
  ({ style }: StyledProps) => {
    const isCompactLayout = style.layout === 'compact';
    const styles: CssLikeObject = {};

    if (isCompactLayout) {
      styles.padding = px(8);
      styles.width = '100%';
    } else {
      styles.minHeight = px(imageSize);

      if (!style.hideCoverArt) {
        styles.marginLeft = px(8);
        styles.width = `calc(100% - ${px(imageSize + 8)})`;
      } else {
        styles.width = '100%';
      }
    }

    return styles;
  },
  'ContentWrapperRSWP',
);

const Content = styled('div')(
  {
    display: 'flex',
    justifyContent: 'start',

    '[data-type="title-artist-wrapper"]': {
      overflow: 'hidden',

      div: {
        marginLeft: `-${px(8)}`,
        whiteSpace: 'nowrap',
      },
    },

    p: {
      fontSize: px(14),
      lineHeight: 1.3,
      paddingLeft: px(8),
      paddingRight: px(8),
      width: '100%',

      '&:nth-of-type(1)': {
        alignItems: 'center',
        display: 'inline-flex',
      },

      '&:nth-of-type(2)': {
        fontSize: px(12),
      },
    },

    span: {
      display: 'inline-block',
    },
  },
  ({ style }: StyledProps) => {
    const maskImageColor = getBgColor(style.bgColor, style.trackNameColor);

    return {
      '[data-type="title-artist-wrapper"]': {
        color: style.trackNameColor,
        maxWidth: `calc(100% - ${px(style.showSaveIcon ? iconSize : 0)})`,

        div: {
          '-webkit-mask-image': `linear-gradient(90deg,transparent 0, ${maskImageColor} 6px, ${maskImageColor} calc(100% - 12px),transparent)`,
        },
      },
      p: {
        '&:nth-of-type(1)': {
          color: style.trackNameColor,

          a: {
            color: style.trackNameColor,
          },
        },

        '&:nth-of-type(2)': {
          color: style.trackArtistColor,

          a: {
            color: style.trackArtistColor,
          },
        },
      },
    };
  },
  'ContentRSWP',
);

function Info(props: Props) {
  const {
    hideAttribution,
    hideCoverArt,
    isActive,
    layout,
    locale,
    onFavoriteStatusChange,
    showSaveIcon,
    styles: { activeColor, bgColor, color, height, trackArtistColor, trackNameColor },
    token,
    track: { artists = [], id, image, name, uri },
    updateSavedStatus,
  } = props;
  const [isSaved, setIsSaved] = useState(false);
  const isMounted = useRef(false);
  const previousId = usePrevious(id);
  const isCompactLayout = layout === 'compact';

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

  if (showSaveIcon && id) {
    favorite = (
      <button
        aria-label={isSaved ? locale.removeTrack : locale.saveTrack}
        className={`ButtonRSWP${isSaved ? ' rswp__active' : ''}`}
        onClick={handleClickIcon}
        title={isSaved ? locale.removeTrack : locale.saveTrack}
        type="button"
      >
        {isSaved ? <Favorite /> : <FavoriteOutline />}
      </button>
    );
  }

  const content: Record<string, ReactNode> = {};
  const classes = [];

  if (isActive) {
    classes.push('rswp__active');
  }

  if (isCompactLayout) {
    content.image = <img alt={name} src={image} />;
  }

  if (!id) {
    return <div />;
  }

  return (
    <Wrapper
      className={classes.join(' ')}
      data-component-name="Info"
      style={{
        activeColor,
        c: color,
        h: height,
        layout,
        showSaveIcon,
      }}
    >
      {!hideCoverArt && (
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
      <ContentWrapper
        style={{
          hideCoverArt,
          layout,
          showSaveIcon,
        }}
      >
        {!!name && (
          <Content
            style={{
              bgColor,
              layout,
              showSaveIcon,
              trackArtistColor,
              trackNameColor,
            }}
          >
            <div data-type="title-artist-wrapper">
              <div>
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
              </div>
            </div>
            {favorite}
          </Content>
        )}
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
      </ContentWrapper>
    </Wrapper>
  );
}

export default memo(Info);
