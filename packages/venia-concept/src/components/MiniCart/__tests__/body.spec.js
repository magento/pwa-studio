import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Body from '../body';

const renderer = new ShallowRenderer();

const baseProps = {
    beginEditItem: jest.fn(),
    cart: {
        details: {},
        totals: {}
    }
};

test('renders the product list when appropriate', () => {
    const tree = renderer.render(<Body {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders the loading indicator when appropriate', () => {
    const testProps = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };

    const tree = renderer.render(<Body {...testProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders the empty mini cart when appropriate', () => {
    const testProps = {
        ...baseProps,
        isCartEmpty: true
    };

    const tree = renderer.render(<Body {...testProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders the edit item dialog when appropriate', () => {
    const testProps = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isEditingItem: true
        }
    };

    const tree = renderer.render(<Body {...testProps} />);

    expect(tree).toMatchSnapshot();
});
