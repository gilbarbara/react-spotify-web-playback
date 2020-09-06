import * as React from 'react';
import { checkTracksStatus, saveTracks, removeTracks } from '../spotify';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';
import { SpotifyPlayerTrack } from '../types/spotify';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';

interface Props {
  handleFavoriteStatusChange: (status: boolean) => any;
  isActive: boolean;
  showSaveIcon: boolean;
  track: SpotifyPlayerTrack;
  token: string;
  styles: StylesOptions;
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
  ({ styles }: StyledComponentProps) => ({
    height: px(styles.height),

    img: {
      height: px(styles.height),
      width: px(styles.height),
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
  ({ styles }: StyledComponentProps) => ({
    width: `calc(100% - ${px(styles.height)})`,

    p: {
      color: styles.trackNameColor,

      '&:last-child': {
        color: styles.trackArtistColor,
      },
    },

    button: {
      color: styles.color,

      '&.rswp__active': {
        color: styles.savedColor,
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

  public async componentDidUpdate(prevProps: Props) {
    const { showSaveIcon, track } = this.props;

    if (showSaveIcon && prevProps.track.id !== track.id && track.id) {
      this.updateState({ isSaved: false });

      await this.setStatus();
    }
  }

  public componentWillUnmount() {
    this.isActive = false;
  }

  private handleClickIcon = async () => {
    const { isSaved } = this.state;
    const { handleFavoriteStatusChange, token, track } = this.props;

    if (isSaved) {
      await removeTracks(token, track.id);
      this.updateState({ isSaved: false });
    } else {
      await saveTracks(token, track.id);
      this.updateState({ isSaved: true });
    }

    handleFavoriteStatusChange(!isSaved);
  };

  private setStatus = async () => {
    if (!this.isActive) {
      return;
    }

    const { handleFavoriteStatusChange, token, track, updateSavedStatus } = this.props;

    if (updateSavedStatus && track.id) {
      updateSavedStatus((newStatus: boolean) => {
        this.updateState({ isSaved: newStatus });
      });
    }

    const status = await checkTracksStatus(token, track.id);
    const [isSaved] = status || [false];

    this.updateState({ isSaved });
    handleFavoriteStatusChange(isSaved);
  };

  private updateState = (state = {}) => {
    if (!this.isActive) {
      return;
    }

    this.setState(state);
  };

  public render() {
    const { isSaved } = this.state;
    const { isActive, showSaveIcon, styles, track } = this.props;
    let icon;

    if (showSaveIcon && track.id) {
      icon = (
        <button
          onClick={this.handleClickIcon}
          className={isSaved ? 'rswp__active' : undefined}
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
      <Wrapper styles={styles} className={classes.join(' ')}>
        {track.image && <img src={track.image} alt={track.name} />}
        <Title styles={styles}>
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
