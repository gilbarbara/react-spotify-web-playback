import * as React from 'react';
import { keyframes, px, styled } from '../styles';

import { StyledComponentProps } from '../types/common';

const Wrapper = styled('div')(
  {
    margin: '0 auto',
    position: 'relative',

    '> div': {
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 0,
      boxSizing: 'border-box',
      height: 0,
      left: '50%',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 0,
    },
  },
  ({ styles }: StyledComponentProps) => {
    const pulse = keyframes!({
      '0%': {
        height: 0,
        width: 0,
      },

      '30%': {
        borderWidth: px(8),
        height: px(styles.loaderSize),
        opacity: 1,
        width: px(styles.loaderSize),
      },

      '100%': {
        borderWidth: 0,
        height: px(styles.loaderSize),
        opacity: 0,
        width: px(styles.loaderSize),
      },
    });

    return {
      height: px(styles.loaderSize),
      width: px(styles.loaderSize),

      '> div': {
        animation: `${pulse} 1.15s infinite cubic-bezier(0.215, 0.61, 0.355, 1)`,
        borderColor: styles.loaderColor,
      },
    };
  },
  'LoaderRSWP',
);

function Loader({ styles }: StyledComponentProps) {
  return (
    <Wrapper styles={styles}>
      <div />
    </Wrapper>
  );
}

export default Loader;
