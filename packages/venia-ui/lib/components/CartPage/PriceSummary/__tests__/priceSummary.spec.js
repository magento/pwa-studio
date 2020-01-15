import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import PriceSummary from '../priceSummary';
import { useQuery } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
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
    const useQuery = jest.fn(() => queryResult);

    return { useQuery };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine', () => {
    const Price = props => <span>{`$${props.value}`}</span>;

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});

const defaultProps = {
    classes: {
        root: 'root',
        lineItems: 'lineItems',
        price: 'price',
        totalLabel: 'totalLabel',
        totalPrice: 'totalPrice',
        checkoutButton_container: 'checkoutButton_container'
    }
};

test('renders PriceSummary correctly', () => {
    const tree = createTestInstance(<PriceSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders an error state if query fails', () => {
    useQuery.mockReturnValueOnce({
        error: true
    });

    const tree = createTestInstance(<PriceSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if query is loading', () => {
    useQuery.mockReturnValueOnce({
        loading: true
    });

    const tree = createTestInstance(<PriceSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
test('renders nothing if query returns no items', () => {
    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                items: [
                    // Intentionally empty
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
    });

    const tree = createTestInstance(<PriceSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
