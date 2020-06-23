import * as React from 'react';
import { px, styled } from '../styles';

import { StyledComponentProps } from '../types/common';

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',

    '> *': {
      width: '100%',

      '@media (min-width: 600px)': {
        width: '33.3333%',
      },
    },

    '@media (min-width: 600px)': {
      flexDirection: 'row',
    },
  },
  ({ styles }: StyledComponentProps) => ({
    minHeight: px(styles.height),
  }),
  'ContentRSWP',
);

function Content({ children, styles }: StyledComponentProps) {
  return <Wrapper styles={styles}>{children}</Wrapper>;
}

export default Content;
