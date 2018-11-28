import React from 'react';
import { BrowserPersistence } from './util/simplePersistence';

const peregrine = jest.requireActual('../../../peregrine/src');

const mockRequest = jest.fn();

const RestApi = {
    Magento2: {
        request: mockRequest
    }
};

const Util = {
    BrowserPersistence: BrowserPersistence
};

/**
 * the Price component from @magento/peregrine
 * has browser-specific functionality and cannot
 * currently by rendered in the test environment
 */
const Price = () => <div />;

module.exports = {
    ...peregrine,
    mockRequest,
    RestApi,
    Util,
    Price
};
