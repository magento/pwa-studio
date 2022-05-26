import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';
jest.mock('../product', () => 'Product');

const defaultProps = {
    beginEditItem: jest.fn(),
    cartItems: [
        {
            item_id: 1,
            name: 'unit test',
            price: 99,
            product_type: 'product type',
            qty: 1,
            quote_id: 1,
            sku: 'sku1'
        },
        {
            item_id: 2,
            name: 'unit test',
            price: 99,
            product_type: 'product type',
            qty: 1,
            quote_id: 1,
            sku: 'sku2'
        }
    ],
    currencyCode: 'USD'
};

test('renders a list with no items when items are not supplied', () => {
    const props = {
        ...defaultProps,
        cartItems: []
    };
    const tree = createTestInstance(<ProductList {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a list of Products when items are supplied', () => {
    const tree = createTestInstance(<ProductList {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
