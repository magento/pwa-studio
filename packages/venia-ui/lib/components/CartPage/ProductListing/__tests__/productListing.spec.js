import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import LoadingIndicator from '../../../LoadingIndicator';
import ProductListing from '../productListing';

const queryResult = {
    loading: false,
    error: null,
    data: null
};

jest.mock('../../../../classify');
jest.mock('@apollo/react-hooks', () => {
    const useQuery = jest.fn(() => {});

    return { useQuery };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../product', () => 'Product');

test('renders loading indicator while data fetching', () => {
    useQuery.mockImplementationOnce(() => {
        return {
            ...queryResult,
            loading: true
        };
    });

    const { root } = createTestInstance(<ProductListing />);
    expect(root.findByType(LoadingIndicator)).toBeDefined();
});

test('renders string with no items in cart', () => {
    useQuery.mockImplementationOnce(() => ({
        ...queryResult,
        data: {
            cart: {
                items: []
            }
        }
    }));
    const tree = createTestInstance(<ProductListing />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders list of products with items in cart', () => {
    useQuery.mockImplementationOnce(() => ({
        ...queryResult,
        data: {
            cart: {
                items: ['1', '2', '3']
            }
        }
    }));
    const tree = createTestInstance(<ProductListing />);

    expect(tree.toJSON()).toMatchSnapshot();
});
