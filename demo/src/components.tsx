import { ComponentProps, useCallback } from 'react';
import { Layout, RepeatState, spotifyApi } from 'react-spotify-web-playback';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { BoxInline, ButtonUnstyled, Icon, theme } from '@gilbarbara/components';

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

export function RepeatButton({
  repeat,
  token,
  ...rest
}: Omit<ComponentProps<typeof ButtonUnstyled>, 'children'> & {
  repeat: RepeatState;
  token: string;
}) {
  const handleClick = useCallback(async () => {
    let value: RepeatState = 'off';

    if (repeat === 'off') {
      value = 'track';
    } else if (repeat === 'context') {
      value = 'track';
    }

    await spotifyApi.repeat(token, value);
  }, [repeat, token]);

  let title = 'Enable repeat';

  if (repeat === 'track') {
    title = 'Disable repeat';
  }

  if (repeat === 'context') {
    title = 'Enable repeat one';
  }

  return (
    <ButtonUnstyled
      height={32}
      justify="center"
      onClick={handleClick}
      title={title}
      width={32}
      {...rest}
    >
      <BoxInline as="span" position="relative">
        <Icon name="repeat-alt" size={24} title={null} />
        {repeat !== 'off' && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              position: 'absolute',
              top: 5,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {repeat === 'track' ? '1' : 'all'}
          </span>
        )}
      </BoxInline>
    </ButtonUnstyled>
  );
}

export function ShuffleButton({
  shuffle,
  token,
  ...rest
}: Omit<ComponentProps<typeof ButtonUnstyled>, 'children'> & {
  shuffle: boolean;
  token: string;
}) {
  const handleClick = useCallback(async () => {
    await spotifyApi.shuffle(token, !shuffle);
  }, [shuffle, token]);

  return (
    <ButtonUnstyled
      height={32}
      justify="center"
      onClick={handleClick}
      title={`${shuffle ? 'Disable' : 'Enable'} repeat`}
      width={32}
      {...rest}
    >
      <BoxInline as="span" position="relative">
        <Icon name="shuffle" size={20} title={null} />
        {shuffle && (
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              position: 'absolute',
              top: '50%',
              left: -2,
              transform: 'translateY(-50%)',
            }}
          >
            ⏺
          </span>
        )}
      </BoxInline>
    </ButtonUnstyled>
  );
}
