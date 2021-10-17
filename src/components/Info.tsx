import * as React from 'react';

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

interface State {
  isSaved: boolean;
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

export default class Info extends React.PureComponent<Props, State> {
  private isActive = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSaved: false,
    };
  }

  public async componentDidMount() {
    this.isActive = true;

    const { showSaveIcon, track } = this.props;

    if (showSaveIcon && track.id) {
      await this.setStatus();
    }
  }

  public async componentDidUpdate(previousProps: Props) {
    const { showSaveIcon, track } = this.props;

    if (showSaveIcon && previousProps.track.id !== track.id && track.id) {
      this.updateState({ isSaved: false });

      await this.setStatus();
    }
  }

  public componentWillUnmount() {
    this.isActive = false;
  }

  private handleClickIcon = async () => {
    const { isSaved } = this.state;
    const { onFavoriteStatusChange, token, track } = this.props;

    if (isSaved) {
      await removeTracks(token, track.id);
      this.updateState({ isSaved: false });
    } else {
      await saveTracks(token, track.id);
      this.updateState({ isSaved: true });
    }

    onFavoriteStatusChange(!isSaved);
  };

  private setStatus = async () => {
    if (!this.isActive) {
      return;
    }

    const { onFavoriteStatusChange, token, track, updateSavedStatus } = this.props;

    if (updateSavedStatus && track.id) {
      updateSavedStatus((newStatus: boolean) => {
        this.updateState({ isSaved: newStatus });
      });
    }

    const status = await checkTracksStatus(token, track.id);
    const [isSaved] = status || [false];

    this.updateState({ isSaved });
    onFavoriteStatusChange(isSaved);
  };

  private updateState = (state = {}) => {
    if (!this.isActive) {
      return;
    }

    this.setState(state);
  };

  public render() {
    const { isSaved } = this.state;
    const {
      isActive,
      locale,
      showSaveIcon,
      styles: { activeColor, color, height, trackArtistColor, trackNameColor },
      track: { id, name, uri, image, artists = [] },
    } = this.props;
    const title = getSpotifyLinkTitle(name, locale.title);
    let icon;

    /* istanbul ignore else */
    if (showSaveIcon && id) {
      icon = (
        <button
          className={isSaved ? 'rswp__active' : undefined}
          onClick={this.handleClickIcon}
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
      <Wrapper className={classes.join(' ')} style={{ h: height }}>
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
}
