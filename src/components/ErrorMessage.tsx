import * as React from 'react';
import { px, styled } from '../styles';

import { ComponentsProps, StyledProps } from '../types/common';

const Wrapper = styled('p')(
  {
    textAlign: 'center',
    width: '100%',
  },
  ({ style }: StyledProps) => ({
    borderTop: `1px solid ${style.errorColor}`,
    color: style.errorColor,
    height: px(style.h),
    lineHeight: px(style.h),
  }),
  'ErrorRSWP',
);

function ErrorMessage({ children, styles: { errorColor, height } }: ComponentsProps) {
  return <Wrapper style={{ errorColor, h: height }}>{children}</Wrapper>;
}

export default ErrorMessage;
