import { ComponentProps, useCallback } from 'react';
import { spotifyApi } from 'react-spotify-web-playback';
import { BoxInline, ButtonUnstyled, Icon } from '@gilbarbara/components';

export default function ShuffleButton({
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
