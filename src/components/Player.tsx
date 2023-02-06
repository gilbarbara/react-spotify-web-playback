import { forwardRef } from 'react';

import { put, px } from '~/modules/styled';

import { ComponentsProps } from '~/types';

put('.PlayerRSWP', {
  boxSizing: 'border-box',
  fontSize: 'inherit',
  width: '100%',

  '*': {
    boxSizing: 'border-box',
  },

  button: {
    appearance: 'none',
    background: 'transparent',
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

const Player = forwardRef<HTMLDivElement, ComponentsProps>(
  ({ children, styles: { bgColor, height }, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className="PlayerRSWP"
        data-component-name="Player"
        style={{ background: bgColor, minHeight: px(height) }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default Player;
