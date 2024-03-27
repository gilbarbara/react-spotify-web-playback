import { css, Global } from '@emotion/react';
import { theme } from '@gilbarbara/components';

export default function GlobalStyles({ hasToken }: any) {
  return (
    <Global
      styles={css`
        body {
          background: linear-gradient(
              0deg,
              oklch(0.65 0.3 29.62 / 0.8),
              oklch(0.65 0.3 29.62 / 0) 75%
            ),
            linear-gradient(60deg, oklch(0.96 0.25 110.23 / 0.8), oklch(0.96 0.25 110.23 / 0) 75%),
            linear-gradient(120deg, oklch(0.85 0.36 144.24 / 0.8), oklch(0.85 0.36 144.24 / 0) 75%),
            linear-gradient(180deg, oklch(0.89 0.2 194.59 / 0.8), oklch(0.89 0.2 194.18 / 0) 75%),
            linear-gradient(240deg, oklch(0.47 0.32 264.05 / 0.8), oklch(0.47 0.32 264.05 / 0) 75%),
            linear-gradient(300deg, oklch(0.7 0.35 327.92 / 0.8), oklch(0.7 0.35 327.92 / 0) 75%);
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
