import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import {
    useShippingMethod,
    serializeShippingMethod
} from '../useShippingMethod';

/*
 *  Mocks.
 */
jest.mock('@apollo/react-hooks', () => {
    const getSelectedAndAvailableShippingMethodsResult = {
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

    return {
        ...jest.requireActual('@apollo/react-hooks'),
        useLazyQuery: jest.fn().mockReturnValue([
            jest.fn(),
            {
                data: getSelectedAndAvailableShippingMethodsResult,
                loading: false
            }
        ]),
        useMutation: jest.fn().mockReturnValue([jest.fn()])
    };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = { drawer: '' };
    const api = {
        closeDrawer: jest.fn(),
        toggleDrawer: jest.fn()
    };

    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
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
        getSelectedAndAvailableShippingMethods:
            'getSelectedAndAvailableShippingMethods'
    },
    mutations: {
        setShippingMethod: 'setShippingMethod'
    },
    setPageIsUpdating: jest.fn()
};

/*
 *  Tests.
 */
test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        displayState: expect.any(String),
        handleCancelUpdate: expect.any(Function),
        handleSubmit: expect.any(Function),
        isLoading: expect.any(Boolean),
        isUpdateMode: expect.any(Boolean),
        selectedShippingMethod: expect.any(Object),
        shippingMethods: expect.any(Array),
        showUpdateMode: expect.any(Function)
    });
});

test('it serializes properly', () => {
    // Arrange.
    const shippingMethod = {
        carrier_code: 'unit test carrier',
        method_code: 'unit test method'
    };

    // Act.
    const result = serializeShippingMethod(shippingMethod);

    // Assert.
    expect(result).toBe('unit test carrier|unit test method');
});
