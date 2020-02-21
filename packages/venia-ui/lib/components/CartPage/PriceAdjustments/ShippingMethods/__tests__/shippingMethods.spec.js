import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import ShippingMethods from '../shippingMethods';
import Button from '../../../../Button';

jest.mock('../../../../../classify');

jest.mock('@apollo/react-hooks', () => {
    return { useLazyQuery: jest.fn() };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../shippingForm', () => 'ShippingForm');
jest.mock('../shippingRadios', () => 'ShippingRadios');

test('renders description and confirm link w/o shipping address set', () => {
    useLazyQuery.mockReturnValue([
        jest.fn(),
        {
            data: null
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders address form when confirm link clicked', () => {
    useLazyQuery.mockReturnValue([
        jest.fn(),
        {
            data: null
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    const { root } = instance;
    const { onClick } = root.findByType(Button).props;
    onClick();
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders address form and methods with address set', () => {
    useLazyQuery.mockReturnValue([
        jest.fn(),
        {
            data: {
                cart: {
                    shipping_addresses: [
                        {
                            available_shipping_methods: [
                                {
                                    amount: {
                                        value: 100
                                    },
                                    method_title: 'Expensive'
                                },
                                {
                                    amount: {
                                        value: 0
                                    },
                                    method_title: 'Free'
                                }
                            ],
                            country: {
                                code: 'US'
                            },
                            postcode: '78701',
                            region: {
                                code: 'TX'
                            },
                            selected_shipping_method: {
                                carrier_code: 'usps',
                                method_code: 'priority'
                            }
                        }
                    ]
                }
            }
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});
