import * as React from 'react';
import { px, styled } from '../styles';

import { ComponentsProps, StyledProps } from '../types/common';

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',

    '> *': {
      width: '100%',

      '@media (min-width: 1024px)': {
        width: '33.3333%',
      },
    },

    '@media (min-width: 1024px)': {
      flexDirection: 'row',
    },
  },
  ({ style }: StyledProps) => ({
    minHeight: px(style.h),
  }),
  'ContentRSWP',
);

function Content({ children, styles }: ComponentsProps) {
  return <Wrapper style={{ h: styles.height }}>{children}</Wrapper>;
}

export default Content;
