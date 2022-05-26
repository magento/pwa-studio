import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import PriceSummary from '../priceSummary';

jest.mock('../../../../classify');
jest.mock('react-router-dom', () => ({
    Link: jest.fn(() => 'Proceed to Checkout')
}));
jest.mock('@apollo/client', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: {
            cart: {
                items: [
                    {
                        quantity: 1
                    }
                ],
                applied_gift_cards: [],
                shipping_addresses: [
                    {
                        selected_shipping_method: {
                            amount: {
                                value: 0,
                                currency: 'USD'
                            }
                        }
                    }
                ],
                prices: {
                    subtotal_excluding_tax: {
                        currency: 'USD',
                        value: 11
                    },
                    grand_total: {
                        currency: 'USD',
                        value: 10
                    },
                    discounts: [
                        {
                            amount: {
                                value: 1,
                                currency: 'USD'
                            }
                        }
                    ],
                    applied_taxes: [
                        {
                            amount: {
                                value: 0,
                                currency: 'USD'
                            }
                        }
                    ]
                }
            }
        },
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return {
        gql: jest.fn(),
        useLazyQuery
    };
});

const defaultTalonProps = {
    hasError: false,
    hasItems: true,
    isCheckout: false,
    isLoading: false,
    flatData: {
        subtotal: { currency: 'USD', value: 3.5 },
        total: { currency: 'USD', value: 8.5 },
        discounts: null,
        giftCards: [],
        giftOptions: {},
        taxes: [],
        shipping: { currency: 'USD', value: 5 }
    }
};

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary',
    () => ({
        usePriceSummary: jest.fn().mockReturnValue({
            hasError: false,
            hasItems: true,
            isCheckout: false,
            isLoading: false,
            flatData: {
                subtotal: { currency: 'USD', value: 3.5 },
                total: { currency: 'USD', value: 8.5 },
                discounts: null,
                giftCards: [],
                giftOptions: {},
                taxes: [],
                shipping: { currency: 'USD', value: 5 }
            }
        })
    })
);

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

test('renders PriceSummary correctly on cart page', () => {
    const tree = createTestInstance(<PriceSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders PriceSummary correctly on checkout page', () => {
    usePriceSummary.mockReturnValueOnce({
        ...defaultTalonProps,
        isCheckout: true
    });

    const tree = createTestInstance(<PriceSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders an error state if query fails', () => {
    usePriceSummary.mockReturnValueOnce({
        ...defaultTalonProps,
        hasError: true
    });

    const tree = createTestInstance(<PriceSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders summary with loading state if query is loading', () => {
    usePriceSummary.mockReturnValueOnce({
        ...defaultTalonProps,
        isLoading: true
    });

    const tree = createTestInstance(<PriceSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if query returns no items', () => {
    usePriceSummary.mockReturnValueOnce({
        ...defaultTalonProps,
        hasItems: false
    });

    const tree = createTestInstance(<PriceSummary />);

    expect(tree.toJSON()).toMatchSnapshot();
});
