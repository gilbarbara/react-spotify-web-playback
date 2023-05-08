import { forwardRef } from 'react';

import { px } from '~/modules/styled';

import { ComponentsProps } from '~/types';

const Player = forwardRef<HTMLDivElement, ComponentsProps>((props, ref) => {
  const {
    children,
    styles: { bgColor, height },
    ...rest
  } = props;

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
});

export default Player;
