import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';

jest.mock('../product');
jest.mock('../productListFooter');

const baseProps = {
    cart: {
        details: {
            currency: {
                quote_currency_code: 'US'
            }
        }
    }
};

test('renders a list with no items when items are not supplied', () => {
    const tree = createTestInstance(
        <ProductList {...baseProps} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders a list of Products when items are supplied', () => {
    const props = {
        ...baseProps,
        items: [{
            item_id: 1,
            name: 'unit test',
            price: 99,
            product_type: 'product type',
            qty: 1,
            quote_id: 1,
            sku: 'sku'
        }]
    };
    const tree = createTestInstance(
        <ProductList {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});