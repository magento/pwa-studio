import React from 'react';
import { BrowserPersistence } from './util/simplePersistence';

const peregrine = jest.requireActual('../../../peregrine/src');

// re-exports
const RestApi = {
    Magento2: {
        request: jest.fn()
    }
};

const Util = { BrowserPersistence };

// hooks
const useApolloContext = jest.fn(peregrine.useApolloContext);
const useEventListener = jest.fn(peregrine.useEventListener);
const useDropdown = jest.fn(peregrine.useDropdown);
const useQuery = jest.fn(peregrine.useQuery);
const useQueryResult = jest.fn(peregrine.useQueryResult);
const useSearchParam = jest.fn(peregrine.useSearchParam);
const useWindowSize = jest.fn(peregrine.useWindowSize);
const useToasts = jest.fn(peregrine.useToasts);
// components

/**
 * the Price component from @magento/peregrine
 * has browser-specific functionality and cannot
 * currently by rendered in the test environment
 */
const Price = jest.fn().mockReturnValue(<div />);

module.exports = {
    ...peregrine,
    Price,
    RestApi,
    Util,
    useApolloContext,
    useEventListener,
    useDropdown,
    useQuery,
    useQueryResult,
    useSearchParam,
    useWindowSize,

    useToasts
};
