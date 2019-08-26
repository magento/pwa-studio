import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Trigger from '../cartTrigger';

const classes = {
    root: 'a'
};
const getCartDetails = jest.fn();
const toggleCart = jest.fn();

test('Cart icon svg has no fill when cart is empty', () => {
    const props = {
        cart: {
            details: {
                items_qty: 0
            }
        },
        classes,
        getCartDetails,
        toggleCart
    };

    const component = createTestInstance(<Trigger {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('Cart icon svg has fill and correct value when cart contains items', () => {
    const props = {
        cart: {
            details: {
                items_qty: 10
            }
        },
        classes,
        getCartDetails,
        toggleCart
    };

    const component = createTestInstance(<Trigger {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
