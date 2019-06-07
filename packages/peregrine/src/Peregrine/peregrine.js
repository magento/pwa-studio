import React from 'react';
import { ToastContextProvider } from '../Toasts';
import { WindowSizeContextProvider } from '../hooks/useWindowSize';

const Peregrine = props => (
    <WindowSizeContextProvider>
        <ToastContextProvider>{props.children}</ToastContextProvider>
    </WindowSizeContextProvider>
);

export default Peregrine;
