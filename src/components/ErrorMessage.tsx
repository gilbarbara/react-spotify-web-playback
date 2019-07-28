import * as React from 'react';
import { px, styled } from '../styles';

import { IStyledComponentProps } from '../types/common';

const Wrapper = styled('p')(
  {
    textAlign: 'center',
    width: '100%',
  },
  ({ styles }: IStyledComponentProps) => ({
    borderTop: `1px solid ${styles.errorColor}`,
    color: styles.errorColor,
    height: px(styles.height),
    lineHeight: px(styles.height),
  }),
  'ErrorRSWP',
);

const ErrorMessage = ({ children, styles }: IStyledComponentProps) => {
  return <Wrapper styles={styles}>{children}</Wrapper>;
};

export default ErrorMessage;
