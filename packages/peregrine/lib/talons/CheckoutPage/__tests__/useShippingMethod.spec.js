import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import { useShippingMethod } from '../useShippingMethod';

/*
 *  Mocks.
 */
jest.mock('@apollo/react-hooks', () => {
    return {
        ...jest.requireActual('@apollo/react-hooks'),
        useLazyQuery: jest.fn(),
        useMutation: jest.fn().mockReturnValue([jest.fn()])
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

/*
 *  Member Variables.
 */
const getShippingMethodsResult = {
    cart: {
        shipping_addresses: [
            {
                available_shipping_methods: [
                    {
                        amount: {
                            currency: 'USD',
                            value: '99'
                        },
                        carrier_code: 'carrier code',
                        method_code: 'method code',
                        method_title: 'method title'
                    }
                ],
                selected_shipping_method: {
                    amount: {
                        currency: 'USD',
                        value: '99'
                    },
                    carrier_code: 'carrier code',
                    method_code: 'method code',
                    method_title: 'method title'
                }
            }
        ]
    }
};
const getSelectedShippingMethodResult = {
    cart: {
        shipping_addresses: [
            {
                selected_shipping_method: {
                    amount: {
                        currency: 'USD',
                        value: '99'
                    },
                    carrier_code: 'carrier code',
                    method_code: 'method code',
                    method_title: 'method title'
                }
            }
        ]
    }
};

const log = jest.fn();
const Component = props => {
    const talonProps = useShippingMethod({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    onSave: jest.fn(),
    queries: {
        getShippingMethods: 'getShippingMethods',
        getSelectedShippingMethod: 'getSelectedShippingMethod'
    },
    mutations: {
        setShippingMethod: 'setShippingMethod'
    }
};

/*
 *  Tests.
 */
test('it returns the proper shape', () => {
    // Arrange.

    // getSelectedShippingMethod
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: getSelectedShippingMethodResult,
            loading: false
        }
    ]);

    // getShippingMethods
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: getShippingMethodsResult,
            loading: false
        }
    ]);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        displayState: expect.any(String),
        handleSubmit: expect.any(Function),
        isLoadingShippingMethods: expect.any(Boolean),
        isLoadingSelectedShippingMethod: expect.any(Boolean),
        selectedShippingMethod: expect.any(String),
        shippingMethods: expect.any(Array),
        showEditMode: expect.any(Function)
    });
});
