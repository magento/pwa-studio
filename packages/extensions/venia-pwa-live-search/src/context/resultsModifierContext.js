/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext } from 'react';

const ResultsModifierContext = createContext({
    baseUrl: '',
    baseUrlWithoutProtocol: ''
});

const ResultsModifierProvider = ({
    baseUrl,
    baseUrlWithoutProtocol,
    children
}) => {
    return (
        <ResultsModifierContext.Provider
            value={{ baseUrl, baseUrlWithoutProtocol }}
        >
            {children}
        </ResultsModifierContext.Provider>
    );
};

const useResultsModifier = () => {
    return useContext(ResultsModifierContext);
};

export { ResultsModifierProvider, useResultsModifier };
