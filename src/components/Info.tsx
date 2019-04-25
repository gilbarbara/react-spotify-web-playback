import React, { PureComponent } from 'react';
import { checkTracksStatus, saveTracks, removeTracks } from '../spotify';
import { px, styled } from '../styles';

import { StyledComponentProps, StylesOptions } from '../types/common';
import { PlayerTrack } from '../types/spotify';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';

interface Props {
  isActive: boolean;
  showSaveIcon: boolean;
  track: PlayerTrack;
  token: string;
  styles: StylesOptions;
}

interface State {
  isSaved: boolean;
}

const Wrapper = styled('div')({}, ({ styles }: StyledComponentProps) => ({
  alignItems: 'center',
  display: 'flex',
  height: px(styles.height),
  textAlign: 'left',

  '@media (max-width: 599px)': {
    borderBottom: '1px solid #ccc',
    display: 'none',
    width: '100%',
  },

  '&.rswp__active': {
    '@media (max-width: 599px)': {
      display: 'flex',
    },
  },

  img: {
    height: px(styles.height),
    width: px(styles.height),
  },

  p: {
    '&:first-child': {
      alignItems: 'center',
      display: 'inline-flex',

      button: {
        fontSize: '110%',
        marginLeft: px(5),

        '&:focus': {
          outline: 'none',
        },

        '&.rswp__active': {
          color: styles.savedColor,
        },
      },
    },
  },
}));

const Title = styled('div')({}, ({ styles }: StyledComponentProps) => ({
  marginLeft: px(10),
  whiteSpace: 'nowrap',

  p: {
    color: styles.trackNameColor,
    fontSize: px(14),
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',

    '&:last-child': {
      color: styles.trackArtistColor,
    },
  },
}));

export default class Info extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSaved: false,
    };
  }

  public async componentDidMount() {
    const { token, track } = this.props;

    if (track.id) {
      await checkTracksStatus(track.id, token).then(d => {
        const [isSaved] = d;

        this.setState({ isSaved });
      });
    }
  }

  public async componentDidUpdate(prevProps: Props) {
    const { token, track } = this.props;

    if (prevProps.track.id !== track.id && track.id) {
      this.setState({ isSaved: false });

      await checkTracksStatus(track.id, token).then(d => {
        const [isSaved] = d;

        this.setState({ isSaved });
      });
    }
  }

  private handleClickIcon = async () => {
    const { isSaved } = this.state;
    const { token, track } = this.props;

    if (isSaved) {
      await removeTracks(track.id, token).then(() => {
        this.setState({ isSaved: false });
      });
    } else {
      await saveTracks(track.id, token).then(() => {
        this.setState({ isSaved: true });
      });
    }
  };

  public render() {
    const { isSaved } = this.state;
    const { isActive, showSaveIcon, styles, track } = this.props;
    let icon;

    if (showSaveIcon && track.id) {
      icon = (
        <button onClick={this.handleClickIcon} className={isSaved ? 'rswp__active' : undefined}>
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
        <img src={track.image} alt={track.name} />
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
