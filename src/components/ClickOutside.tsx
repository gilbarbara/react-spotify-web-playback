import { ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  onClick: () => any;
}

export default function ClickOutside({ children, onClick, ...rest }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (event.type === 'touchend') {
        isTouchRef.current = true;
      }

      if (event.type === 'click' && isTouchRef.current) {
        return;
      }

      const el = containerRef.current;

      if (el && !el.contains(event.target as Node)) {
        onClick();
      }
    },
    [onClick],
  );

  useEffect(() => {
    document.addEventListener('touchend', handleClick, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('touchend', handleClick, true);
      document.removeEventListener('click', handleClick, true);
    };
  });

  return (
    <div {...rest} ref={containerRef}>
      {children}
    </div>
  );
}
