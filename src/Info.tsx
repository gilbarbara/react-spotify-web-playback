import React, { PureComponent } from 'react';
import { checkTracksStatus, saveTracks, removeTracks } from './spotify';

import { PlayerTrack } from './types/spotify';

import Favorite from './icons/Favorite';
import FavoriteOutline from './icons/FavoriteOutline';

interface Props {
  showSaveIcon: boolean;
  track: PlayerTrack;
  token: string;
}

export interface State {
  isSaved: boolean;
}

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
    const { showSaveIcon, track } = this.props;
    let icon;

    if (showSaveIcon && track.id) {
      icon = (
        <button onClick={this.handleClickIcon} className={isSaved ? 'rswp__active' : undefined}>
          {isSaved ? <Favorite /> : <FavoriteOutline />}
        </button>
      );
    }

    return (
      <div className="rswp__info">
        <img src={track.image} alt={track.name} />
        <div className="rswp__title">
          <p>
            <span>{track.name}</span>
            {icon}
          </p>
          <p>{track.artists}</p>
        </div>
      </div>
    );
  }
}
