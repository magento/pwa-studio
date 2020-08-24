import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import { useShippingMethod } from '../useShippingMethod';
import { useMutation } from '@apollo/client';

/*
 *  Mocks.
 */
jest.mock('@apollo/client', () => {
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
        ...jest.requireActual('@apollo/client'),
        useQuery: jest.fn().mockReturnValue({
            data: getSelectedAndAvailableShippingMethodsResult,
            loading: false
        }),
        useMutation: jest.fn().mockReturnValue([
            jest.fn(),
            {
                loading: false
            }
        ])
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = { isSignedIn: false };
    const api = {};

    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
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

const setPageIsUpdating = jest.fn();

const props = {
    onSave: jest.fn(),
    queries: {
        getSelectedAndAvailableShippingMethods:
            'getSelectedAndAvailableShippingMethods'
    },
    mutations: {
        setShippingMethod: 'setShippingMethod'
    },
    setPageIsUpdating
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
        errors: expect.any(Map),
        handleCancelUpdate: expect.any(Function),
        handleSubmit: expect.any(Function),
        isLoading: expect.any(Boolean),
        isUpdateMode: expect.any(Boolean),
        selectedShippingMethod: expect.any(Object),
        shippingMethods: expect.any(Array),
        showUpdateMode: expect.any(Function)
    });
});

test('returns Apollo error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: 'setShippingMethod Error' }
    ]);

    createTestInstance(<Component {...props} />);
    const talonProps = log.mock.calls[0][0];

    expect(talonProps.formErrors).toMatchSnapshot();
});

test('handleSubmit fires necessary mutations and callbacks', async () => {
    const setShippingMethod = jest.fn();
    useMutation.mockReturnValueOnce([setShippingMethod, {}]);

    createTestInstance(<Component {...props} />);

    let talonProps = log.mock.calls[0][0];
    const { handleSubmit, showUpdateMode } = talonProps;

    // flip to true to verify mutation succeeded, which flips back to false
    act(() => {
        showUpdateMode();
    });

    talonProps = log.mock.calls[1][0];

    expect(talonProps.isUpdateMode).toEqual(true);

    await act(async () => {
        await handleSubmit({ shipping_method: 'usps|flatrate' });
    });

    const mutationProps = setShippingMethod.mock.calls[0][0];
    talonProps = log.mock.calls[2][0];

    expect(mutationProps).toMatchSnapshot();
    expect(setPageIsUpdating.mock.calls[0][0]).toEqual(true);
    expect(setPageIsUpdating.mock.calls[1][0]).toEqual(false);
    expect(talonProps.isUpdateMode).toEqual(false);
});

test('handleSubmit bails on thrown exception', async () => {
    useMutation.mockReturnValue([
        jest.fn().mockRejectedValue('Apollo Error'),
        {}
    ]);

    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];
    const { handleSubmit, showUpdateMode } = talonProps;

    // flip to true to verify mutation succeeded, which flips back to false
    act(() => {
        showUpdateMode();
    });

    await act(async () => {
        await handleSubmit({ shipping_method: 'usps|flatrate' });
    });

    expect(setPageIsUpdating.mock.calls[0][0]).toEqual(true);
    expect(setPageIsUpdating.mock.calls[1][0]).toEqual(false);
    // a bit fragile, but the only check we can do is that our component state
    // didn't change because of the caught exception and has not rendered again
    expect(log).toHaveBeenCalledTimes(2);
});
