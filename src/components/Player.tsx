import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps } from '../types/common';

const Wrapper = styled('div')(
  {
    boxSizing: 'border-box',
    fontSize: 'inherit',
    width: '100%',

    '*': {
      boxSizing: 'border-box',
    },

    button: {
      appearance: 'none',
      backgroundColor: 'transparent',
      border: 0,
      borderRadius: 0,
      color: 'inherit',
      cursor: 'pointer',
      display: 'inline-flex',
      lineHeight: 1,
      padding: 0,

      ':focus': {
        outlineColor: '#000',
        outlineOffset: 3,
      },
    },

    p: {
      margin: 0,
    },
  },
  ({ styles }: IStyledComponentProps) => ({
    backgroundColor: styles.bgColor,
    minHeight: px(styles.height),
  }),
  'PlayerRSWP',
);

const Player = ({ children, styles }: IStyledComponentProps) => {
  return <Wrapper styles={styles}>{children}</Wrapper>;
};

export default Player;
