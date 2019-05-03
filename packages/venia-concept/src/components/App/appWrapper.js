import React from 'react';
import App from './container';

import { WindowSizeContextProvider } from './WindowSizeContext';

/**
 * A functional wrapper so that we can provide context to the entire app
 * without having to rewrite the App file itself.
 */
function AppWrapper() {
    return (
        <WindowSizeContextProvider>
            <App />
        </WindowSizeContextProvider>
    );
}

export default AppWrapper;
