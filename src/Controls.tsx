import React from 'react';
import { WebPlaybackTrack } from './spotify';

import Next from './icons/Next';
import Pause from './icons/Pause';
import Play from './icons/Play';
import Previous from './icons/Previous';

interface Props {
  isExternalDevice: boolean;
  isPlaying: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickTogglePlay: () => void;
  nextTracks: WebPlaybackTrack[];
  previousTracks: WebPlaybackTrack[];
}

const Controls = ({
  isExternalDevice,
  isPlaying,
  onClickNext,
  onClickPrevious,
  onClickTogglePlay,
  nextTracks,
  previousTracks,
}: Props) => (
  <div className="rswp__controls">
    <div>
      {(!!previousTracks.length || isExternalDevice) && (
        <button type="button" onClick={onClickPrevious} aria-label="Previous Track">
          <Previous />
        </button>
      )}
    </div>
    <div>
      <button
        type="button"
        className="rswp__toggle"
        onClick={onClickTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
    <div>
      {(!!nextTracks.length || isExternalDevice) && (
        <button type="button" onClick={onClickNext} aria-label="Next Track">
          <Next />
        </button>
      )}
    </div>
  </div>
);

export default Controls;
