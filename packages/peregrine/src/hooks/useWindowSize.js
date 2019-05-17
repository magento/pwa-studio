import React, { createContext, useContext, useState } from 'react';
import { useEventListener } from './useEventListener';

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

    useEventListener(window, 'resize', handleResize);

    return windowSize;
};

/**
 * This component contains a hook that listens for resize events. It is
 * recommended to only create/use a single time at the top level of your app
 * ex:
 *   <WindowSizeContextProvider>
 *     <App />
 *   </WindowSizeContextProvider>
 */
export const WindowSizeContextProvider = props => {
    // This hook has side effects of adding listeners so we only want to create it
    // once and store it in context for reference by components.
    const windowSize = useWindowSizeListener();

    return (
        <WindowSizeContext.Provider value={windowSize}>
            {props.children}
        </WindowSizeContext.Provider>
    );
};

export const useWindowSize = () => useContext(WindowSizeContext);
