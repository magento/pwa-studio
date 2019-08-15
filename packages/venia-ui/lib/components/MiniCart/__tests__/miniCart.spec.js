import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MiniCart from '../miniCart';

const renderer = new ShallowRenderer();

const baseProps = {
    beginEditItem: jest.fn(),
    cancelCheckout: jest.fn(),
    cart: {
        details: {
            currency: {
                quote_currency_code: 'NZD'
            },
            items: [
                {
                    item_id: 1,
                    name: 'Unit Test Item',
                    price: 99,
                    product_type: 'configurable',
                    qty: 1,
                    quote_id: '1234',
                    sku: 'SKU'
                }
            ],
            items_qty: 1
        },
        editItem: null,
        isEditingItem: false,
        isLoading: false,
        isUpdatingItem: false,
        totals: {
            subtotal: 99
        }
    },
    closeDrawer: jest.fn(),
    endEditItem: jest.fn(),
    isCartEmpty: false,
    isMiniCartMaskOpen: false,
    isOpen: true,
    removeItemFromCart: jest.fn(),
    updateItemInCart: jest.fn()
};

test('renders the correct tree', () => {
    const tree = renderer.render(<MiniCart {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('doesnt render a footer when cart is empty', () => {
    const props = {
        ...baseProps,
        isCartEmpty: true
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[3];
    expect(footer).toBeNull();
});

test('doesnt render a footer when cart is editing', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isEditingItem: true
        }
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[3];
    expect(footer).toBeNull();
});

test('doesnt render a footer when cart is loading', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };

    renderer.render(<MiniCart {...props} />);
    const result = renderer.getRenderOutput();

    const footer = result.props.children[3];
    expect(footer).toBeNull();
});
