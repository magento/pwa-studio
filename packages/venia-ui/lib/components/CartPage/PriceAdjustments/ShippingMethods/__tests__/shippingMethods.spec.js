import React from 'react';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import ShippingMethods from '../shippingMethods';
import Button from '../../../../Button';

jest.mock('../../../../../classify');

jest.mock('@apollo/client', () => {
    return {
        gql: jest.fn(),
        useQuery: jest.fn()
    };
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
    useQuery.mockReturnValue({
        data: null
    });

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders address form when confirm link clicked', () => {
    useQuery.mockReturnValue({
        data: null
    });

    const instance = createTestInstance(<ShippingMethods />);
    const { root } = instance;
    const { onClick } = root.findByType(Button).props;
    onClick();
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders address form and methods with address set', () => {
    useQuery.mockReturnValue({
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
    });

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});
