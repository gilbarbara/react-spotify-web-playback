import * as React from 'react';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';

import { checkTracksStatus, removeTracks, saveTracks } from '../spotify';
import { px, styled } from '../styles';
import { StyledProps, StylesOptions } from '../types/common';
import { SpotifyPlayerTrack } from '../types/spotify';

interface Props {
  isActive: boolean;
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
      color: style.trackNameColor,

      '&:last-child': {
        color: style.trackArtistColor,
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
      showSaveIcon,
      styles: { activeColor, color, height, trackArtistColor, trackNameColor },
      track,
    } = this.props;
    let icon;

    /* istanbul ignore else */
    if (showSaveIcon && track.id) {
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
        {track.image && <img alt={track.name} src={track.image} />}
        <Title style={{ c: color, h: height, activeColor, trackArtistColor, trackNameColor }}>
          <p>
            <span>{track.name}</span>
            {icon}
          </p>
          <p>{track.artists}</p>
        </Title>
      </Wrapper>
    );
  }
}
