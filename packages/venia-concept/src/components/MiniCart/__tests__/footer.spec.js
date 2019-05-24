import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Footer from '../footer';

jest.mock('../totalsSummary');
jest.mock('src/components/Checkout', () => {
    return jest.fn().mockReturnValue('( Checkout Component Here )');
});
jest.mock('src/components/Checkout/checkoutButton', () => {
    return jest.fn().mockReturnValue('( Checkout Button Component Here )');
});

const baseProps = {
    cart: {
        isEditingItem: false,
        isLoading: false
    },
    isCartEmpty: false,
    isMiniCartMaskOpen: false
};

test('renders totals summary and checkout components', () => {
    const tree = createTestInstance(<Footer {...baseProps} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('returns null when cart is empty', () => {
    const props = {
        ...baseProps,
        isCartEmpty: true

    };
    const tree = createTestInstance(<Footer {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('returns null when cart is loading', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };
    const tree = createTestInstance(<Footer {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('returns null when cart is editing item', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isEditingItem: true
        }
    };
    const tree = createTestInstance(<Footer {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
