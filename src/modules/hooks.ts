import { useEffect, useRef, useState } from 'react';

export function useMediaQuery(input: string): boolean {
  const getMatches = (query: string): boolean => {
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(input));

  function handleChange() {
    setMatches(getMatches(input));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(input);

    // Triggered at the first client-side load and if query changes
    handleChange();

    try {
      matchMedia.addEventListener('change', handleChange);
      /* c8 ignore next 4 */
    } catch {
      // Safari isn't supporting matchMedia.addEventListener
      matchMedia.addListener(handleChange);
    }

    return () => {
      try {
        matchMedia.removeEventListener('change', handleChange);
        /* c8 ignore next 4 */
      } catch {
        // Safari isn't supporting matchMedia.removeEventListener
        matchMedia.removeListener(handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return matches;
}

export function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
