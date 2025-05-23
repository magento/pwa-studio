import { useCallback, useState } from 'react';
import useEventListener from './useEventListener';

const documentScrollTop = () =>
  document.body.scrollTop || document.documentElement.scrollTop;

const documentScrollLeft = () =>
  document.body.scrollLeft || document.documentElement.scrollLeft;

const useViewedOffsets = () => {
  const [offsets, setOffsets] = useState(() => {
    const xOffset = documentScrollLeft();
    const yOffset = documentScrollTop();
    return {
      minXOffset: xOffset,
      maxXOffset: xOffset + window.innerWidth,
      minYOffset: yOffset,
      maxYOffset: yOffset + window.innerHeight,
    };
  });
  let waitingOnAnimRequest = false;

  // Update refs for resetting the scroll position after navigation
  // Do we need this? Or could we just reset both to the current scroll position when the location changes?
  const handleChange = () => {
    if (!waitingOnAnimRequest) {
      requestAnimationFrame(() => {
        const windowLeft = documentScrollLeft();
        const windowRight = windowLeft + window.innerWidth;
        const windowTop = documentScrollTop();
        const windowBottom = windowTop + window.innerHeight;
        const newOffsets = { ...offsets };
        if (windowRight > offsets.maxXOffset) {
          newOffsets.maxXOffset = windowRight;
        }
        if (windowLeft < offsets.minXOffset) {
          newOffsets.minXOffset = windowLeft;
        }
        if (windowBottom > offsets.maxYOffset) {
          newOffsets.maxYOffset = windowBottom;
        }
        if (windowTop < offsets.minYOffset) {
          newOffsets.minYOffset = windowTop;
        }
        setOffsets(newOffsets);
        waitingOnAnimRequest = false;
      });
      waitingOnAnimRequest = true;
    }
  };

  useEventListener(window, 'scroll', handleChange);
  useEventListener(window, 'resize', handleChange);

  const resetScrollOffsets = useCallback(() => {
    const windowLeft = documentScrollLeft();
    const windowRight = windowLeft + window.innerWidth;
    const windowTop = documentScrollTop();
    const windowBottom = windowTop + window.innerHeight;
    setOffsets({
      minXOffset: windowLeft,
      maxXOffset: windowRight,
      minYOffset: windowTop,
      maxYOffset: windowBottom,
    });
  }, []);

  return {
    resetScrollOffsets,
    offsets,
  };
};

export default useViewedOffsets;
