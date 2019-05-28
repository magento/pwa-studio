import React from 'react';
import ShallowRenderer from 'react-test-renderer/Shallow';

import Footer from '../footer';

const renderer = new ShallowRenderer();

const baseProps = {
    cart: {
        isEditingItem: false,
        isLoading: false
    },
    isCartEmpty: false,
    isMiniCartMaskOpen: false
};

test('renders totals summary and checkout components', () => {
    const tree = renderer.render(<Footer {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('returns null when cart is empty', () => {
    const props = {
        ...baseProps,
        isCartEmpty: true
    };
    const tree = renderer.render(<Footer {...props} />);

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
    const tree = renderer.render(<Footer {...props} />);

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
    const tree = renderer.render(<Footer {...props} />);

    expect(tree).toMatchSnapshot();
});
