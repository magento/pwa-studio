/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCT_COLUMNS } from '../utils/constants';

// Removed TypeScript interfaces

const DefaultScreenSizeObject = {
    mobile: false,
    tablet: false,
    desktop: false,
    columns: PRODUCT_COLUMNS.desktop
};

const useSensor = () => {
    const { screenSize } = useContext(ResizeChangeContext);

    const [result, setResult] = useState(DefaultScreenSizeObject);

    useEffect(() => {
        const size = screenSize ? screenSize : DefaultScreenSizeObject;
        setResult(size);
    }, [screenSize]);

    return { screenSize: result };
};

export const ResizeChangeContext = createContext({});

const getColumn = screenSize => {
    if (screenSize.desktop) {
        return PRODUCT_COLUMNS.desktop;
    }
    if (screenSize.tablet) {
        return PRODUCT_COLUMNS.tablet;
    }
    if (screenSize.mobile) {
        return PRODUCT_COLUMNS.mobile;
    }
    // Fallback just in case
    return PRODUCT_COLUMNS.desktop;
};

const Resize = ({ children }) => {
    const detectDevice = () => {
        const result = { ...DefaultScreenSizeObject };

        result.mobile = window.matchMedia(
            'screen and (max-width: 767px)'
        ).matches;
        result.tablet = window.matchMedia(
            'screen and (min-width: 768px) and (max-width: 960px)'
        ).matches;
        result.desktop = window.matchMedia(
            'screen and (min-width: 961px)'
        ).matches;
        result.columns = getColumn(result);
        return result;
    };

    const [screenSize, setScreenSize] = useState(detectDevice());

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const handleResize = () => {
        setScreenSize({ ...screenSize, ...detectDevice() });
    };

    return (
        <ResizeChangeContext.Provider value={{ screenSize }}>
            {children}
        </ResizeChangeContext.Provider>
    );
};

export default Resize;

export { useSensor };
