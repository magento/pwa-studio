import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import LegacyMiniCart from '../miniCart';
import Body from '../body';
import Footer from '../footer';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

jest.mock('../body', () => 'Body');
jest.mock('../footer', () => 'Footer');

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { closeDrawer: jest.fn() };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        derivedDetails: {
            currencyCode: 'USD',
            numItems: 0,
            subtotal: 0
        },
        details: {}
    };
    const api = { updateItemInCart: jest.fn() };
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
            derivedDetails: {
                currencyCode: 'NZD',
                numItems: 1,
                subtotal: 99
            },
            details: {
                items: [
                    {
                        id: 1,
                        product: {
                            name: 'Unit Test Item',
                            sku: 'SKU',
                            price: {
                                regularPrice: {
                                    amount: {
                                        value: 99
                                    }
                                }
                            }
                        },
                        quantity: 1,
                        __typename: 'configurable'
                    }
                ],
                prices: {
                    grand_total: {
                        value: 99,
                        currency: 'NZD'
                    }
                }
            },
            editItem: null,
            isEditingItem: false,
            isLoading: false,
            isUpdatingItem: false
        },
        cartApi
    ]);

    const instance = createTestInstance(<LegacyMiniCart {...baseProps} />);

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

    const instance = createTestInstance(<LegacyMiniCart {...baseProps} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});

test('doesnt render a footer when cart is editing', () => {
    const instance = createTestInstance(<LegacyMiniCart {...baseProps} />);

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

    const instance = createTestInstance(<LegacyMiniCart {...baseProps} />);
    expect(() => {
        instance.root.findByType(Footer);
    }).toThrow();
});
