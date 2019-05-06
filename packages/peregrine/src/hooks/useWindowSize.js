import React, { createContext, useContext, useEffect, useState } from 'react';

const WindowSizeContext = createContext();

const getSize = () => {
    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth
    };
};

/**
 * A hook that will return inner and outer height and width values whenever
 * the window is resized.
 */
const useWindowSizeListener = () => {
    const [windowSize, setWindowSize] = useState(getSize());

    const handleResize = () => {
        setWindowSize(getSize());
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Passing empty array to only run effect on mount and unmount.

    return windowSize;
};

const WindowSizeContextProvider = props => {
    // This hook has side effects of adding listeners so we only want to create it
    // once and store it in context for reference by components.
    const windowSize = useWindowSizeListener();

    return (
        <WindowSizeContext.Provider value={windowSize}>
            {props.children}
        </WindowSizeContext.Provider>
    );
};

export default WindowSizeContextProvider;
export const useWindowSize = () => useContext(WindowSizeContext);
