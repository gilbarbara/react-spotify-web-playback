import * as React from 'react';
import { px, styled } from '../styles';

import { StyledComponentProps } from '../types/common';

const Wrapper = styled('p')(
  {
    textAlign: 'center',
    width: '100%',
  },
  ({ styles }: StyledComponentProps) => ({
    borderTop: `1px solid ${styles.errorColor}`,
    color: styles.errorColor,
    height: px(styles.height),
    lineHeight: px(styles.height),
  }),
  'ErrorRSWP',
);

function ErrorMessage({ children, styles }: StyledComponentProps) {
  return <Wrapper styles={styles}>{children}</Wrapper>;
}

export default ErrorMessage;
