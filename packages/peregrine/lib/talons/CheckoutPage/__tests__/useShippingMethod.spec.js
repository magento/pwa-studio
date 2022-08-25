import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import {
    useShippingMethod,
    displayStates
} from '../ShippingMethod/useShippingMethod';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

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

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

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
const onSuccess = jest.fn();

const props = {
    onSave: jest.fn(),
    queries: {
        getSelectedAndAvailableShippingMethods:
            'getSelectedAndAvailableShippingMethods'
    },
    mutations: {
        setShippingMethod: 'setShippingMethod'
    },
    setPageIsUpdating,
    onSuccess
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

test('should setPageIsUpdating to mutation loading state', () => {
    const setShippingMethod = jest.fn();
    useMutation.mockReturnValueOnce([
        setShippingMethod,
        {
            loading: false
        }
    ]);

    createTestInstance(<Component {...props} />);

    expect(setPageIsUpdating.mock.calls[0][0]).toEqual(false);

    useMutation.mockReturnValueOnce([
        setShippingMethod,
        {
            loading: true
        }
    ]);

    createTestInstance(<Component {...props} />);

    expect(setPageIsUpdating.mock.calls[1][0]).toEqual(true);
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

    // a bit fragile, but the only check we can do is that our component state
    // didn't change because of the caught exception and has not rendered again
    expect(log).toHaveBeenCalledTimes(2);
});

test('returns the proper display state when loading data', () => {
    useQuery.mockImplementation(() => {
        return {
            loading: true
        };
    });
    useMutation.mockImplementation(() => {
        return [
            jest.fn(),
            {
                loading: true
            }
        ];
    });

    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps.displayState).toEqual(displayStates.INITIALIZING);
});

test('should return default values when shipping addresses data is not found', () => {
    useQuery.mockImplementation(() => {
        return {
            loading: false,
            data: { cart: { shipping_addresses: {} } }
        };
    });

    createTestInstance(<Component {...props} />);
    const talonProps = log.mock.calls[0][0];

    expect(talonProps.shippingMethods).toEqual([]);
    expect(talonProps.selectedShippingMethod).toBeNull();
});

test('should handle cancelling an update', async () => {
    createTestInstance(<Component {...props} />);
    const talonProps = log.mock.calls[0][0];

    await act(async () => {
        talonProps.showUpdateMode();
    });

    createTestInstance(<Component {...props} />);
    const updatedProps = log.mock.calls[1][0];

    expect(updatedProps.isUpdateMode).toBeTruthy();

    updatedProps.handleCancelUpdate();
    const finalProps = log.mock.calls[2][0];

    expect(finalProps.isUpdateMode).toBeFalsy();
});

test('should auto-select the least expensive shipping method when none is set', async () => {
    useQuery.mockImplementation(() => {
        return {
            loading: false,
            data: {
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
                                },
                                {
                                    amount: {
                                        currency: 'USD',
                                        value: '50'
                                    },
                                    carrier_code: 'another carrier code',
                                    method_code: 'another method code',
                                    method_title: 'another method title'
                                }
                            ]
                        }
                    ]
                }
            }
        };
    });

    useUserContext.mockImplementation(() => [
        {
            isSignedIn: true
        },
        {}
    ]);

    const setShippingMethod = jest.fn();

    useMutation.mockReturnValueOnce([setShippingMethod, {}]);

    createTestInstance(<Component {...props} />);

    expect(setShippingMethod).toHaveBeenCalledWith({
        variables: {
            cartId: expect.any(String),
            shippingMethod: {
                carrier_code: 'another carrier code',
                method_code: 'another method code'
            }
        }
    });
});

test('does not try to set shipping method when cartId is not present', () => {
    useUserContext.mockImplementation(() => [
        {
            isSignedIn: true
        },
        {}
    ]);

    useCartContext.mockImplementation(() => [{}, {}]);

    const setShippingMethod = jest.fn();

    useMutation.mockReturnValueOnce([setShippingMethod, {}]);

    createTestInstance(<Component {...props} />);

    expect(setShippingMethod).not.toHaveBeenCalled();
});

test('does not auto-select a shipping method on a signed in user when there is no shipping methods available', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                cart: {
                    shipping_addresses: [
                        {
                            available_shipping_methods: []
                        }
                    ]
                }
            }
        };
    });
    useUserContext.mockImplementation(() => [
        {
            isSignedIn: true
        },
        {}
    ]);
    useCartContext.mockImplementation(() => [{ cartId: 'cart123' }, {}]);

    createTestInstance(<Component {...props} />);

    const setShippingMethod = jest.fn();

    useMutation.mockReturnValueOnce([setShippingMethod, {}]);

    expect(setShippingMethod).not.toHaveBeenCalled();
});

test('does not auto-select a shipping method on a signed in user when it has already been selected', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
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
            }
        };
    });
    useUserContext.mockImplementation(() => [
        {
            isSignedIn: true
        },
        {}
    ]);
    useCartContext.mockImplementation(() => [{ cartId: 'cart123' }, {}]);

    createTestInstance(<Component {...props} />);

    const setShippingMethod = jest.fn();

    useMutation.mockReturnValueOnce([setShippingMethod, {}]);

    expect(setShippingMethod).not.toHaveBeenCalled();
});

test('should call onSuccess on mutation success', () => {
    createTestInstance(<Component {...props} />);

    const { onCompleted } = useMutation.mock.calls[0][1];
    onCompleted();

    expect(onSuccess).toHaveBeenCalled();
});

test('should dispatch add/update event', async () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    createTestInstance(<Component {...props} />);
    let talonProps = log.mock.calls[0][0];

    await act(async () => {
        await talonProps.handleSubmit({ shipping_method: 'usps|flatrate' });
    });

    act(() => {
        talonProps.showUpdateMode();
    });
    talonProps = log.mock.calls[1][0];

    await act(async () => {
        await talonProps.handleSubmit({
            shipping_method: 'freeshipping|freeshipping'
        });
    });

    expect(mockDispatchEvent).toHaveBeenCalledTimes(2);
    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot('added');
    expect(mockDispatchEvent.mock.calls[1][0]).toMatchSnapshot('updated');
});
