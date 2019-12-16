import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CartOptions from '../cartOptions';

const renderer = new ShallowRenderer();

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        details: {},
        totals: {}
    };
    const api = { updateItemInCart: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

test('it renders the correct tree', () => {
    const props = {
        cartItem: {
            item_id: 99,
            name: 'cartItem name',
            price: 99,
            qty: 99
        },
        configItem: {
            __typename: 'simple'
        },
        currencyCode: 'USD',
        endEditItem: jest.fn(),
        updateCart: jest.fn()
    };

    const tree = renderer.render(<CartOptions {...props} />);

    expect(tree).toMatchSnapshot();
});
