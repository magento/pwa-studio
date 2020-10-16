import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';
import VeniaAdapter from '../adapter';
import { BrowserRouter } from 'react-router-dom';

import StoreCodeRoute from '../../components/StoreCodeRoute';

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

test('verify StoreCodeRoute to handle store codes in URL is present when store code in URL is enabled', () => {
    process.env.USE_STORE_CODE_IN_URL = true;

    useState.mockReturnValueOnce([true, jest.fn()]);

    const component = createTestInstance(<VeniaAdapter {...adapterProps} />);

    expect(() => component.root.findByType(StoreCodeRoute)).not.toThrow();
});
