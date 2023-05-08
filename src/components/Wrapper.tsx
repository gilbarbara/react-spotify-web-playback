import { memo } from 'react';

import { CssLikeObject, px, styled } from '~/modules/styled';

import { ComponentsProps, StyledProps } from '~/types';

const StyledWrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',

    '> *': {
      width: '100%',
    },
  },
  ({ style }: StyledProps) => {
    let styles: CssLikeObject = {};

    if (style.layout === 'responsive') {
      styles = {
        '> *': {
          '@media (min-width: 768px)': {
            width: '33.3333%',
          },
        },

        '@media (min-width: 768px)': {
          flexDirection: 'row',
          padding: `0 ${px(8)}`,
        },
      };
    }

    return {
      minHeight: px(style.h),
      ...styles,
    };
  },
  'WrapperRSWP',
);

function Wrapper(props: ComponentsProps) {
  const { children, layout, styles } = props;

  return (
    <StyledWrapper data-component-name="Wrapper" style={{ h: styles.height, layout }}>
      {children}
    </StyledWrapper>
  );
}

export default memo(Wrapper);
