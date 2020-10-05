import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';
import VeniaAdapter from '../adapter';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import {
    mockSetItem,
    mockGetItem
} from '../../../../peregrine/lib/util/simplePersistence';

jest.mock('../../../../peregrine/lib/util/simplePersistence');

jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    Util: {
        BrowserPersistence: function() {
            return {
                getItem: jest.fn(),
                setItem: jest.fn()
            };
        }
    }
}));

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});

jest.mock('@apollo/client', () => {
    const actualClient = jest.requireActual('@apollo/client');
    const concat = jest.fn(x => x);
    const request = jest.fn();
    const mockLink = jest.fn(() => ({
        concat,
        request
    }));
    mockLink.createHttpLink = mockLink;
    mockLink.concat = concat;
    mockLink.request = request;
    return {
        ...actualClient,
        createHttpLink: mockLink,
        gql: jest.fn(),
        ApolloProvider: ({ children }) => children
    };
});

jest.mock('react-redux', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(Component => ({
            Component: jest.fn(Component),
            mapDispatchToProps,
            mapStateToProps
        }))
    ),
    Provider: ({ children }) => children
}));

const adapterProps = {
    apiBase: '',
    store: {
        dispatch: jest.fn(),
        getState: jest.fn(),
        replaceReducer: jest.fn(),
        subscribe: jest.fn()
    }
};

test('check BrowserRouter has basename passed to it when use store code in URL is enabled', () => {
    process.env.USE_STORE_CODE_IN_URL = true;

    useState.mockReturnValueOnce([true, jest.fn()]);

    const component = createTestInstance(<VeniaAdapter {...adapterProps} />);

    expect(component.root.findByType(BrowserRouter).props.basename).toEqual(
        '/default'
    );
});

test('verify <Route /> to handle store codes in URL is present when store code in URL is enabled', () => {
    process.env.USE_STORE_CODE_IN_URL = true;
    global.AVAILABLE_STORE_VIEWS = [
        {
            base_currency_code: 'USD',
            code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            store_name: 'Default Store View'
        },
        {
            base_currency_code: 'EUR',
            code: 'french',
            default_display_currency_code: 'EUR',
            id: 2,
            locale: 'fr_FR',
            store_name: 'French'
        }
    ];

    useState.mockReturnValueOnce([true, jest.fn()]);

    const component = createTestInstance(<VeniaAdapter {...adapterProps} />);

    expect(component.root.findByType(Route).props.path).toEqual(
        '/:storeCode(default|french)?'
    );
});

test('verify <Route /> handler updates store on navigation when store code in URL is enabled', () => {
    process.env.USE_STORE_CODE_IN_URL = true;
    global.AVAILABLE_STORE_VIEWS = [
        {
            base_currency_code: 'USD',
            code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            store_name: 'Default Store View'
        },
        {
            base_currency_code: 'EUR',
            code: 'french',
            default_display_currency_code: 'EUR',
            id: 2,
            locale: 'fr_FR',
            store_name: 'French'
        }
    ];

    const originalLocation = window.location;
    delete window.location;
    window.location = {
        ...originalLocation,
        pathname: '/default/test.html'
    };

    mockGetItem.mockReturnValue('default');

    useState.mockReturnValueOnce([true, jest.fn()]);

    // Render the adapter and instantly redirect to the other store
    createTestInstance(
        <VeniaAdapter {...adapterProps}>
            <Redirect to="/french/test.html" />
        </VeniaAdapter>
    );

    expect(mockSetItem.mock.calls).toEqual([
        ['store_view_code', 'french'],
        ['store_view_currency', 'EUR']
    ]);

    window.location = originalLocation;
});

test("verify <Route /> handler doesn't update store with multiple store codes in URL", () => {
    process.env.USE_STORE_CODE_IN_URL = true;
    global.AVAILABLE_STORE_VIEWS = [
        {
            base_currency_code: 'USD',
            code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            store_name: 'Default Store View'
        },
        {
            base_currency_code: 'EUR',
            code: 'french',
            default_display_currency_code: 'EUR',
            id: 2,
            locale: 'fr_FR',
            store_name: 'French'
        }
    ];

    const originalLocation = window.location;
    delete window.location;
    window.location = {
        ...originalLocation,
        pathname: '/default/french/test.html'
    };

    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();

    mockGetItem.mockReturnValue('default');

    useState.mockReturnValueOnce([true, jest.fn()]);

    // Render the adapter and instantly redirect to the other store
    createTestInstance(
        <VeniaAdapter {...adapterProps}>
            <Redirect to="/default/french/test.html" />
        </VeniaAdapter>
    );

    expect(mockSetItem).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();

    window.location = originalLocation;
    console.warn = originalConsoleWarn;
});
