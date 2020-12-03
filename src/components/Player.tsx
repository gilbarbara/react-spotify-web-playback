import * as React from 'react';
import { px, styled } from '../styles';

import { ComponentsProps, StyledProps } from '../types/common';

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
  ({ style }: StyledProps) => ({
    backgroundColor: style.bgColor,
    minHeight: px(style.h),
  }),
  'PlayerRSWP',
);

function Player({ children, styles: { bgColor, height } }: ComponentsProps) {
  return <Wrapper style={{ bgColor, h: height }}>{children}</Wrapper>;
}

export default Player;
