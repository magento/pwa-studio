import React from 'react';
import ShallowRenderer from 'react-test-renderer/Shallow';

import ProductList from '../productList';

const renderer = new ShallowRenderer();

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
    const tree = renderer.render(<ProductList {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders a list of Products when items are supplied', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            details: {
                ...baseProps.cart.details,
                items: [
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
                ]
            }
        }
    };
    const tree = renderer.render(<ProductList {...props} />);

    expect(tree).toMatchSnapshot();
});
