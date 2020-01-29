import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import ShippingFields from '../shippingFields';
import ShippingMethods from '../shippingMethods';

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

jest.mock('../shippingFields', () => 'ShippingFields');
jest.mock('../shippingRadios', () => 'ShippingRadios');

test('renders loading message while fetching data', () => {
    useLazyQuery.mockReturnValueOnce([
        () => {},
        {
            called: true,
            loading: true
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders form and shipping fields only when shipping address not entered', () => {
    useLazyQuery.mockReturnValueOnce([
        () => {},
        {
            called: true,
            loading: false,
            error: false,
            data: {
                cart: {
                    shipping_addresses: []
                }
            }
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders shipping methods when shipping method is entered', () => {
    useLazyQuery.mockReturnValueOnce([
        () => {},
        {
            called: true,
            loading: false,
            error: false,
            data: {
                cart: {
                    shipping_addresses: [
                        {
                            available_shipping_methods: ['method1', 'method2'],
                            country: { code: 'US' },
                            postcode: '78758',
                            region: { code: 'TX' },
                            selected_shipping_method: {
                                carrier_code: 'usps',
                                method_code: 'method1'
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

test('applies mask to shipping methods while sibling fetch is in flight', () => {
    useLazyQuery.mockReturnValue([
        () => {},
        {
            called: true,
            loading: false,
            error: false,
            data: {
                cart: {
                    shipping_addresses: [
                        {
                            available_shipping_methods: ['method1', 'method2'],
                            country: { code: 'US' },
                            postcode: '78758',
                            region: { code: 'TX' }
                        }
                    ]
                }
            }
        }
    ]);

    const instance = createTestInstance(<ShippingMethods />);
    const { root } = instance;
    const { setIsFetchingMethods } = root.findByType(ShippingFields).props;
    setIsFetchingMethods(true);
    expect(instance.toJSON()).toMatchSnapshot();
});
