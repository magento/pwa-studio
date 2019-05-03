import React, { createContext } from 'react';
import { useWindowSize } from '@magento/peregrine/src/hooks/useWindowSize';

export const WindowSizeContext = createContext();

export const WindowSizeContextProvider = props => {
    // This hook has side effects of adding listeners so we only want to create it
    // once and store it in context for reference by components.
    const windowSize = useWindowSize();

    return (
        <WindowSizeContext.Provider value={windowSize}>
            {props.children}
        </WindowSizeContext.Provider>
    );
};
