import { Layout } from 'react-spotify-web-playback';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '@gilbarbara/components';

export function GlobalStyles({ hasToken }: any) {
  return (
    <Global
      styles={css`
        body {
          background-color: #f7f7f7;
          box-sizing: border-box;
          font-family: sans-serif;
          margin: 0;
          min-height: 100vh;
          padding: 0 0 ${hasToken ? '100px' : 0};
        }

        .github-corner {
          position: fixed;
          top: 0;
          right: 0;
        }

        .github-corner svg {
          fill: ${theme.colors.primary};
          color: #fff;
        }

        .github-corner .octo-arm {
          transform-origin: 130px 106px;
        }

        .github-corner:hover .octo-arm {
          animation: octocat-wave 560ms ease-in-out;
        }

        @keyframes octocat-wave {
          0%,
          100% {
            transform: rotate(0);
          }
          20%,
          60% {
            transform: rotate(-25deg);
          }
          40%,
          80% {
            transform: rotate(10deg);
          }
        }

        @media (max-width: 500px) {
          .github-corner:hover .octo-arm {
            animation: none;
          }

          .github-corner .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
          }
        }
      `}
    />
  );
}

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Player = styled.div<{ layout: Layout }>(({ layout }) => {
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
