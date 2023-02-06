import { memo, ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function ClickOutside(props: Props) {
  const { children, isActive, onClick, ...rest } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isTouch = useRef(false);

  const handleClick = useRef((event: MouseEvent | TouchEvent) => {
    const container = containerRef.current;

    if (event.type === 'touchend') {
      isTouch.current = true;
    }

    if (event.type === 'click' && isTouch.current) {
      return;
    }

    if (container && !container.contains(event.target as Node)) {
      onClick();
    }
  });

  useEffect(() => {
    const { current } = handleClick;

    if (isActive) {
      document.addEventListener('touchend', current, true);
      document.addEventListener('click', current, true);
    }

    return () => {
      document.removeEventListener('touchend', current, true);
      document.removeEventListener('click', current, true);
    };
  }, [isActive]);

  return (
    <div ref={containerRef} {...rest}>
      {children}
    </div>
  );
}

export default memo(ClickOutside);
