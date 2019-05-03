import React from 'react';
import { useWindowSize } from '@magento/peregrine/src/hooks/useWindowSize';
import App from './container';

import AppContext from './context';

/**
 * A functional wrapper so that we can provide context to the entire app
 * without having to rewrite the App file itself.
 */
function AppWrapper() {
    // This hook has side effects of adding listeners so we only want to create it
    // once and store it in context for reference by components.
    const windowSize = useWindowSize();

    return (
        <AppContext.Provider
            value={{
                windowSize
            }}
        >
            <App />
        </AppContext.Provider>
    );
}

export default AppWrapper;
