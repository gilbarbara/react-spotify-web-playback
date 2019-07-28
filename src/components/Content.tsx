import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps } from '../types/common';

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
  ({ styles }: IStyledComponentProps) => ({
    minHeight: px(styles.height),
  }),
  'ContentRSWP',
);

const Content = ({ children, styles }: IStyledComponentProps) => {
  return <Wrapper styles={styles}>{children}</Wrapper>;
};

export default Content;
