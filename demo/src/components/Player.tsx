import { Layout } from 'react-spotify-web-playback';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Player = styled.div<{ layout: Layout }>(({ layout }) => {
  if (layout === 'responsive') {
    return css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    `;
  }

  return css`
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    bottom: 20px;
    overflow: hidden;
    position: fixed;
    right: 20px;
    width: 320px;
  `;
});

export default Player;
