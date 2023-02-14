import { memo, ReactNode } from 'react';

import { CssLikeObject, px, styled } from '~/modules/styled';

import { Layout, StyledProps, StylesOptions } from '~/types';

interface Props {
  children: ReactNode;
  layout: Layout;
  styles: StylesOptions;
}

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    'pointer-events': 'none',
  },
  ({ style }: StyledProps) => {
    let styles: CssLikeObject = {
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 'auto',
    };

    if (style.layout === 'responsive') {
      styles = {
        '@media (max-width: 767px)': styles,
        '@media (min-width: 768px)': {
          height: px(style.h),
        },
      };
    }

    return {
      height: px(32),
      ...styles,
    };
  },
  'ActionsRSWP',
);

function Actions(props: Props) {
  const { children, layout, styles } = props;

  return (
    <Wrapper data-component-name="Actions" style={{ h: styles.height, layout }}>
      {children}
    </Wrapper>
  );
}

export default memo(Actions);
