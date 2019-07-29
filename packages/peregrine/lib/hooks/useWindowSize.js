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
 *
 * @kind function
 * @private
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
 * This component contains a hook that listens for resize events.
 * Use this component with {@link useWindowSize} to get the value of the resized window.
 *
 * It is recommended to only create/use a single time at the top level of your app
 * @summary A React context provider.
 *
 * @kind function
 *
 * @param {Object} props - React component props
 *
 * @return {Context.Provider} A [React context provider]{@link https://reactjs.org/docs/context.html}
 *
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

/**
 * The current context value for the window size context.
 * This value updates whenever the window is resized.
 *
 * Use this inside a {@link WindowSizeContextProvider}.
 *
 * @type number
 */
export const useWindowSize = () => useContext(WindowSizeContext);
