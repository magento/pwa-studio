import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MiniCart from '../miniCart';

const renderer = new ShallowRenderer();

test('renders the correct tree', () => {
    const props = {
        beginEditItem: jest.fn(),
        endEditItem: jest.fn(),
        cart: {
            isEditingItem: false
        }
    };

    const tree = renderer.render(<MiniCart {...props} />);

    expect(tree).toMatchSnapshot();
});

test('doesnt render a footer when cart is empty', () => {
    const props = {
        beginEditItem: jest.fn(),
        cart: {
            isEditingItem: false
        },
        endEditItem: jest.fn(),
        isCartEmpty: true
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[2];
    expect(footer).toBeNull();
});

test('doesnt render a footer when cart is editing', () => {
    const props = {
        beginEditItem: jest.fn(),
        cart: {
            isEditingItem: true
        },
        endEditItem: jest.fn()
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[2];
    expect(footer).toBeNull();
});

test('doesnt render a footer when cart is loading', () => {
    const props = {
        beginEditItem: jest.fn(),
        cart: {
            isLoading: true
        },
        endEditItem: jest.fn()
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[2];
    expect(footer).toBeNull();
});
