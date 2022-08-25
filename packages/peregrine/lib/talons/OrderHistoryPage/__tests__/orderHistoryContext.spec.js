import React, { useEffect } from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import OrderHistoryContextProvider, {
    useOrderHistoryContext
} from '../orderHistoryContext';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useQuery: jest.fn().mockReturnValue({})
    };
});

const log = jest.fn();
const Consumer = jest.fn(() => {
    const contextValue = useOrderHistoryContext();

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return null;
});

test('renders children', () => {
    const tree = createTestInstance(
        <OrderHistoryContextProvider children={'Context Provider Children'} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('returns empty string if no suffix found in gql', () => {
    createTestInstance(
        <OrderHistoryContextProvider>
            <Consumer />
        </OrderHistoryContextProvider>
    );

    expect(log.mock.calls[0][0]).toMatchSnapshot();
});

test('returns value from backend', () => {
    useQuery.mockReturnValue({
        data: { storeConfig: { product_url_suffix: '.jsx' } }
    });

    createTestInstance(
        <OrderHistoryContextProvider>
            <Consumer />
        </OrderHistoryContextProvider>
    );

    expect(log.mock.calls[0][0]).toMatchSnapshot();
});
