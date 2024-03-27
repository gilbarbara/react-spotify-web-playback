import { ComponentProps, useCallback } from 'react';
import { RepeatState, spotifyApi } from 'react-spotify-web-playback';
import { BoxInline, ButtonUnstyled, Icon } from '@gilbarbara/components';

export default function RepeatButton({
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
        <Icon name="repeat" size={24} title={null} />
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
