import React, { createContext, useCallback, useContext, useState } from 'react';
import { useEventListener } from './useEventListener';

const WindowSizeContext = createContext();

const getSize = () => {
    // 1080x1920 is a common iPhone resolution
    return {
        innerHeight: globalThis.innerHeight || 1920,
        innerWidth: globalThis.innerWidth || 1080,
        outerHeight: globalThis.outerHeight || 1920,
        outerWidth: globalThis.outerWidth || 1080
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
    const element = globalThis.document ? window : null;

    const handleResize = useCallback(() => {
        setWindowSize(getSize());
    }, [setWindowSize]);

    useEventListener(element, 'resize', handleResize);

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
