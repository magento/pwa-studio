import { useEffect } from 'react';

const useEventListener = (target, type, listener) => {
  useEffect(() => {
    target.addEventListener(type, listener);

    return () => {
      target.removeEventListener(type, listener);
    };
  }, [listener, target, type]);
};

export default useEventListener;
