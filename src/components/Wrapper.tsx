import { memo } from 'react';

import { px, styled } from '~/modules/styled';

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

      '@media (min-width: 768px)': {
        width: '33.3333%',
      },
    },

    '@media (min-width: 768px)': {
      flexDirection: 'row',
      padding: `0 ${px(8)}`,
    },
  },
  ({ style }: StyledProps) => ({
    minHeight: px(style.h),
  }),
  'WrapperRSWP',
);

function Wrapper({ children, styles }: ComponentsProps) {
  return (
    <StyledWrapper data-component-name="Wrapper" style={{ h: styles.height }}>
      {children}
    </StyledWrapper>
  );
}

export default memo(Wrapper);
