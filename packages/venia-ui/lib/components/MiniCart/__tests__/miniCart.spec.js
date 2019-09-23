import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import MiniCart from '../miniCart';
import Body from '../body';
import Footer from '../footer';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

jest.mock('../body', () => 'Body');
jest.mock('../footer', () => 'Footer');
jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { closeDrawer: jest.fn() };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        details: {},
        totals: {}
    };
    const api = { updateItemInCart: jest.fn(), removeItemFromCart: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/checkout', () => {
    const state = {};
    const api = { cancelCheckout: jest.fn() };
    const useCheckoutContext = jest.fn(() => [state, api]);

    return { useCheckoutContext };
});

const baseProps = {
    cancelCheckout: jest.fn(),
    isOpen: true
};

test('renders the correct tree', () => {
    const [cartState, cartApi] = useCartContext();
    useCartContext.mockReturnValueOnce([
        {
            ...cartState,
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
        cartApi
    ]);

    const instance = createTestInstance(<MiniCart {...baseProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('doesnt render a footer when cart is empty', () => {
    const [cartState, cartApi] = useCartContext();
    useCartContext.mockReturnValueOnce([
        {
            ...cartState,
            isEmpty: true
        },
        cartApi
    ]);

    const instance = createTestInstance(<MiniCart {...baseProps} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});

test('doesnt render a footer when cart is editing', () => {
    const instance = createTestInstance(<MiniCart {...baseProps} />);

    act(() => {
        instance.root.findByType(Body).props.beginEditItem();
    });

    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});

test('doesnt render a footer when cart is loading', () => {
    const [cartState, cartApi] = useCartContext();
    useCartContext.mockReturnValueOnce([
        {
            ...cartState,
            isLoading: true
        },
        cartApi
    ]);

    const instance = createTestInstance(<MiniCart {...baseProps} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});
