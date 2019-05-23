import React, { createContext, useContext, useState } from 'react';
import { useEventListener } from './useEventListener';

const WindowSizeContext = createContext();

/**
 * An object that contains the inner and outer dimensions for the browser.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window}
 *
 * @typedef WindowSize
 *
 * @property {Number} innerHeight The height of the browser's inner window
 * @property {Number} outerHeight The height of the browser's outer window
 * @property {Number} innerWidth The width of the browser's inner window
 * @property {Number} outerWidth The width of the browser's outer window
 */
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
 * This component provides dynamic window size data for children components that
 * use the {@link useWindowSize} function.
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
 * A function that returns an object with window size data.
 * This value updates whenever the window is resized.
 *
 * Use this inside a child component of {@link WindowSizeContextProvider}.
 *
 * @kind function
 *
 * @return {WindowSize} An object containing data about the browser window size.
 */
export const useWindowSize = () => useContext(WindowSizeContext);
