import { keyframes, px, styled } from '~/modules/styled';

import { ComponentsProps, StyledProps } from '~/types';

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    jsutifyContent: 'center',
    position: 'relative',

    '> div': {
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 0,
      boxSizing: 'border-box',
      height: 0,
      left: '50%',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 0,
    },
  },
  ({ style }: StyledProps) => {
    const pulse = keyframes!({
      '0%': {
        height: 0,
        width: 0,
      },

      '30%': {
        borderWidth: px(8),
        height: px(style.loaderSize),
        opacity: 1,
        width: px(style.loaderSize),
      },

      '100%': {
        borderWidth: 0,
        height: px(style.loaderSize),
        opacity: 0,
        width: px(style.loaderSize),
      },
    });

    return {
      height: px(style.h),

      '> div': {
        animation: `${pulse} 1.15s infinite cubic-bezier(0.215, 0.61, 0.355, 1)`,
        borderColor: style.loaderColor,
        height: px(style.loaderSize),
        width: px(style.loaderSize),
      },
    };
  },
  'LoaderRSWP',
);

export default function Loader({ styles: { height, loaderColor, loaderSize } }: ComponentsProps) {
  return (
    <Wrapper data-component-name="Loader" style={{ h: height, loaderColor, loaderSize }}>
      <div />
    </Wrapper>
  );
}
