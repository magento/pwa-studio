import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import MiniCart from '../miniCart';
import Body from '../body';
import Footer from '../footer';

jest.mock('../body', () => 'Body');
jest.mock('../footer', () => 'Footer');

const baseProps = {
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
    isCartEmpty: false,
    isOpen: true,
    removeItemFromCart: jest.fn(),
    updateItemInCart: jest.fn()
};

test('renders the correct tree', () => {
    const instance = createTestInstance(<MiniCart {...baseProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('doesnt render a footer when cart is empty', () => {
    const props = {
        ...baseProps,
        isCartEmpty: true
    };

    const instance = createTestInstance(<MiniCart {...props} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});

test('doesnt render a footer when cart is editing', () => {
    const props = {
        ...baseProps,
        isCartEmpty: false
    };

    const instance = createTestInstance(<MiniCart {...props} />);

    act(() => {
        instance.root.findByType(Body).props.beginEditItem();
    });

    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});

test('doesnt render a footer when cart is loading', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };

    const instance = createTestInstance(<MiniCart {...props} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});
