import{ useState, useEffect } from "react";

const getSize = () => {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

/**
 * A hook that will return inner and outer height and width values whenever
 * the window is resized.
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getSize());

  const handleResize = () => {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Passing empty array to only run effect on mount and unmount.

  return windowSize;
}
