import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import LoadingIndicator from '../../../LoadingIndicator';
import ProductListing from '../productListing';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing'
);
jest.mock('../../../../classify');
jest.mock('@apollo/react-hooks', () => {
    return { useLazyQuery: jest.fn() };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../product', () => 'Product');
jest.mock('../EditModal', () => 'EditModal');

test('renders null with no items in cart', () => {
    useProductListing.mockReturnValueOnce({
        isLoading: false,
        isUpdating: false,
        items: []
    });

    const tree = createTestInstance(<ProductListing />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders list of products with items in cart', () => {
    useProductListing.mockReturnValueOnce({
        isLoading: false,
        isUpdating: false,
        items: ['1', '2', '3']
    });

    const tree = createTestInstance(<ProductListing />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders loading indicator if isLoading', () => {
    useProductListing.mockReturnValueOnce({
        isLoading: true
    });

    const propsWithClass = {
        classes: {
            root: 'root'
        }
    };

    const tree = createTestInstance(<ProductListing {...propsWithClass} />);

    expect(tree.root.findByType(LoadingIndicator)).toBeTruthy();
});
