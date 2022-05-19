import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Product from '../product';

global.getComputedStyle = jest.fn().mockReturnValue({
    getPropertyValue: jest.fn().mockReturnValue('80px')
});

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {};
    const api = { removeItemFromCart: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const memoSpy = jest.spyOn(React, 'useMemo');
    const stateSpy = jest.spyOn(React, 'useState');

    return Object.assign(React, {
        useMemo: memoSpy,
        useState: stateSpy
    });
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest.fn().mockResolvedValue({ data: { cart: {} } });

    return { useAwaitQuery };
});

const renderer = new ShallowRenderer();

const props = {
    beginEditItem: jest.fn(),
    currencyCode: 'US',
    item: {
        product: {
            name: 'Unit Test Product',
            small_image: {
                url: 'unittest'
            }
        },
        prices: {
            price: {
                value: 99
            }
        },
        configurable_options: [],
        quantity: 1
    },
    removeItemFromCart: jest.fn()
};

test('it renders correctly', () => {
    const tree = renderer.render(<Product {...props} />);

    expect(tree).toMatchSnapshot();
});
