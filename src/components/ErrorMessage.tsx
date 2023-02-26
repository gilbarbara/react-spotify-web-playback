import { px, styled } from '~/modules/styled';

import { ComponentsProps, StyledProps } from '~/types';

const Wrapper = styled('div')(
  {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  },
  ({ style }: StyledProps) => ({
    backgroundColor: style.bgColor,
    borderTop: `1px solid ${style.errorColor}`,
    color: style.errorColor,
    height: px(style.h),
  }),
  'ErrorRSWP',
);

export default function ErrorMessage({
  children,
  styles: { bgColor, errorColor, height },
}: ComponentsProps) {
  return (
    <Wrapper data-component-name="ErrorMessage" style={{ bgColor, errorColor, h: height }}>
      {children}
    </Wrapper>
  );
}
