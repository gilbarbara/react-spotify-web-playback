import * as React from 'react';

import { put, px } from '../styles';
import { ComponentsProps } from '../types/common';

put('.PlayerRSWP', {
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
});

const Player = React.forwardRef<HTMLDivElement, ComponentsProps>(
  ({ children, styles: { bgColor, height } }, ref) => {
    return (
      <div
        ref={ref}
        className="PlayerRSWP"
        style={{ backgroundColor: bgColor, minHeight: px(height) }}
      >
        {children}
      </div>
    );
  },
);

export default Player;
