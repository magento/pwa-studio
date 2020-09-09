import React from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { useFormState } from 'informed';

import createTestInstance from '../../../../util/createTestInstance';
import { useCreditCard, mapAddressData } from '../useCreditCard';

/**
 * Mock Functions
 */

const getAllCountriesQuery = 'getAllCountriesQuery';
const getBillingAddressQuery = 'getBillingAddressQuery';
const getIsBillingAddressSameQuery = 'getIsBillingAddressSameQuery';
const getPaymentNonceQuery = 'getPaymentNonceQuery';
const getShippingAddressQuery = 'getShippingAddressQuery';

const setBillingAddressMutation = 'setBillingAddressMutation';
const setCreditCardDetailsOnCartMutation = 'setCreditCardDetailsOnCartMutation';

const billingAddress = {
    firstName: 'ba fn',
    lastName: 'ba ln',
    country: {
        code: 'US'
    },
    street: ['45678 blvd', 'suite 300'],
    city: 'Austin',
    region: { code: 'TX' },
    postalCode: '78945',
    phoneNumber: '1234567891'
};
const shippingAddress = {
    firstName: 'sa fn',
    lastName: 'sa ln',
    country: {
        code: 'UK'
    },
    street: ['12345 ln', 'apt 123'],
    city: 'London',
    region: { code: 'TX' },
    postalCode: '13245',
    phoneNumber: '7894561231'
};
const shippingAddressQueryResult = {
    data: {
        cart: {
            shippingAddresses: [
                {
                    __typename: 'Shipping Address',
                    ...shippingAddress
                }
            ]
        }
    }
};
const billingAddressQueryResult = {
    data: {
        cart: {
            billingAddress: {
                __typename: 'Billing Address',
                ...billingAddress
            }
        }
    }
};
const isBillingAddressSameQueryResult = {
    data: { cart: { isBillingAddressSame: false } }
};
const samplePaymentNonce = {
    details: {
        cardType: 'Visa',
        lastFour: '****',
        lastTwo: '**'
    },
    description: 'Visa card ending in **',
    type: 'braintree',
    nonce: '+++++++++++++++++'
};
const getAllCountries = jest.fn().mockReturnValue({ data: { countries: {} } });
const getBillingAddress = jest.fn().mockReturnValue(billingAddressQueryResult);
const getShippingAddress = jest
    .fn()
    .mockReturnValue(shippingAddressQueryResult);
const getIsBillingAddressSame = jest
    .fn()
    .mockReturnValue(isBillingAddressSameQueryResult);

const setBillingAddress = jest.fn();
const setCreditCardDetailsOnCart = jest.fn();

const setBillingAddressMutationResult = jest.fn().mockReturnValue([
    setBillingAddress,
    {
        error: null,
        loading: false,
        called: false
    }
]);
const setCreditCardDetailsOnCartMutationResult = jest.fn().mockReturnValue([
    setCreditCardDetailsOnCart,
    {
        error: null,
        loading: false,
        called: false
    }
]);

const writeQuery = jest.fn();

const queries = {
    getAllCountriesQuery,
    getBillingAddressQuery,
    getIsBillingAddressSameQuery,
    getPaymentNonceQuery,
    getShippingAddressQuery
};
const mutations = {
    setBillingAddressMutation,
    setCreditCardDetailsOnCartMutation
};

jest.mock('@apollo/client', () => {
    return {
        useQuery: jest.fn(),
        useApolloClient: jest.fn(),
        useMutation: jest.fn()
    };
});

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('informed', () => ({
    useFormState: jest.fn().mockReturnValue({
        values: {
            isBillingAddressSame: false,
            firstName: '',
            lastName: '',
            country: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            postalCode: '',
            phoneNumber: ''
        },
        errors: {}
    }),
    useFormApi: jest.fn().mockReturnValue({
        validate: jest.fn()
    })
}));

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getAllCountriesQuery) {
            return getAllCountries();
        } else if (query === getBillingAddressQuery) {
            return getBillingAddress();
        } else if (query === getIsBillingAddressSameQuery) {
            return getIsBillingAddressSame();
        } else if (query === getShippingAddressQuery) {
            return getShippingAddress();
        } else {
            return { data: {} };
        }
    });

    useMutation.mockImplementation(mutation => {
        if (mutation === setBillingAddressMutation) {
            return setBillingAddressMutationResult();
        } else if (mutation === setCreditCardDetailsOnCartMutation) {
            return setCreditCardDetailsOnCartMutationResult();
        } else {
            return [jest.fn(), {}];
        }
    });

    useApolloClient.mockReturnValue({
        writeQuery
    });
});

const Component = props => {
    const talonProps = useCreditCard(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

/**
 * Tests
 */

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onReady: () => {},
        onError: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});

test('Shuold call onReady when payment is ready', () => {
    const onReady = jest.fn();
    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onReady,
        onError: () => {}
    });

    talonProps.onPaymentReady();

    expect(onReady).toHaveBeenCalled();
});

test('Shuold call onError when payment nonce generation errored out', () => {
    const error = 'payment error';
    const onError = jest.fn();
    const resetShouldSubmit = jest.fn();

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError,
        onReady: () => {},
        resetShouldSubmit
    });

    talonProps.onPaymentError(error);

    expect(onError).toHaveBeenCalledWith(error);
    expect(resetShouldSubmit).toHaveBeenCalled();
});

test('Should return errors from billing address and payment method mutations', () => {
    const billingResultError = new Error('some billing address mutation error');
    const creditCardResultError = new Error(
        'some payment method mutation error'
    );
    const billingMutationResultMock = [
        () => {},
        {
            loading: false,
            called: true,
            error: billingResultError
        }
    ];
    const ccMutationResultMock = [
        () => {},
        {
            loading: false,
            called: true,
            error: creditCardResultError
        }
    ];
    setBillingAddressMutationResult
        .mockReturnValueOnce(billingMutationResultMock)
        .mockReturnValueOnce(billingMutationResultMock);
    setCreditCardDetailsOnCartMutationResult
        .mockReturnValueOnce(ccMutationResultMock)
        .mockReturnValueOnce(ccMutationResultMock);

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetShouldSubmit: () => {}
    });

    expect(talonProps.errors.get('setCreditCardDetailsOnCartMutation')).toEqual(
        creditCardResultError
    );
    expect(talonProps.errors.get('setBillingAddressMutation')).toEqual(
        billingResultError
    );
});

test('Should return isBillingAddress and billingAddress from cache as initialValues', () => {
    const billingAddress = {
        firstName: 'test',
        lastName: 'test',
        country: {
            code: 'test'
        },
        street: ['test', 'test'],
        city: 'test',
        region: { code: 'test' },
        postalCode: 'test',
        phoneNumber: 'test'
    };
    getBillingAddress.mockReturnValueOnce({
        data: {
            cart: {
                billingAddress: {
                    __typename: 'Billing Address',
                    ...billingAddress
                }
            }
        }
    });
    getIsBillingAddressSame.mockReturnValueOnce({
        data: { cart: { isBillingAddressSame: false } }
    });

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetShouldSubmit: () => {}
    });

    expect(talonProps.initialValues).toMatchObject({
        ...mapAddressData(billingAddress),
        isBillingAddressSame: false
    });
});

test('Should set billingAddress to {} if isBillingAddress is true in initialValues', () => {
    const billingAddress = {
        firstName: 'test',
        lastName: 'test',
        country: {
            code: 'test'
        },
        street: ['test', 'test'],
        city: 'test',
        region: { code: 'test' },
        postalCode: 'test',
        phoneNumber: 'test'
    };
    getBillingAddress.mockReturnValueOnce({
        data: {
            cart: {
                billingAddress: {
                    __typename: 'Billing Address',
                    ...billingAddress
                }
            }
        }
    });
    getIsBillingAddressSame.mockReturnValueOnce({
        data: { cart: { isBillingAddressSame: true } }
    });

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetShouldSubmit: () => {}
    });

    expect(talonProps.initialValues).toMatchObject({
        isBillingAddressSame: true
    });
});

test('Should return isLoading true if isDropinLoading is true', () => {
    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetShouldSubmit: () => {}
    });

    expect(talonProps.isLoading).toBeTruthy();
});

describe('Testing payment nonce request workflow', () => {
    test('Should call setBillingAddressMutation mutation with billing address from UI if isBillingAddressSame is false', () => {
        const billingAddress = {
            firstName: 'test value',
            lastName: 'test value',
            country: 'test value',
            street1: 'test value',
            street2: 'test value',
            city: 'test value',
            region: 'test value',
            postalCode: 'test value',
            phoneNumber: 'test value'
        };
        useFormState
            .mockReturnValueOnce({
                values: {
                    ...billingAddress,
                    isBillingAddressSame: false
                },
                errors: {}
            })
            .mockReturnValueOnce({
                values: {
                    ...billingAddress,
                    isBillingAddressSame: false
                },
                errors: {}
            });

        getTalonProps({
            shouldSubmit: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        expect(setBillingAddress).toBeCalledWith({
            variables: {
                ...billingAddress,
                sameAsShipping: false,
                cartId: '123'
            }
        });
    });

    test('Should call setBillingAddressMutation mutation with shipping address from UI if isBillingAddressSame is true', () => {
        const shippingAddress = {
            firstName: 'test value',
            lastName: 'test value',
            country: {
                code: 'test value'
            },
            street: ['test value', 'test value'],
            city: 'test value',
            region: { code: 'test value' },
            postalCode: 'test value',
            phoneNumber: 'test value'
        };
        getShippingAddress.mockReturnValueOnce({
            data: {
                cart: {
                    shippingAddresses: [
                        {
                            __typename: 'Shipping Address',
                            ...shippingAddress
                        }
                    ]
                }
            }
        });
        useFormState.mockReturnValueOnce({
            values: {
                isBillingAddressSame: true
            },
            errors: {}
        });

        getTalonProps({
            shouldSubmit: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        expect(setBillingAddress).toBeCalledWith({
            variables: {
                ...mapAddressData(shippingAddress),
                sameAsShipping: true,
                cartId: '123'
            }
        });
    });

    test('Should save isBillingAddressSame in apollo cache', () => {
        useFormState.mockReturnValueOnce({
            values: {
                isBillingAddressSame: true
            },
            errors: {}
        });

        getTalonProps({
            shouldSubmit: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        const isBillingAddressSameSaveCall = writeQuery.mock.calls.filter(
            call => call[0].query === getIsBillingAddressSameQuery
        )[0];

        expect(
            isBillingAddressSameSaveCall[0].data.cart.isBillingAddressSame
        ).toBeTruthy();
    });

    test('Should not proceed with saving billing address if form state has errors', () => {
        useFormState.mockReturnValueOnce({
            values: {
                isBillingAddressSame: true
            },
            errors: {
                firstName: 'The Field is Required'
            }
        });

        getTalonProps({
            shouldSubmit: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        expect(setBillingAddress).not.toHaveBeenCalled();
    });
});

describe('Testing payment success workflow', () => {
    test('Should save payment payment nonce in apollo cache', () => {
        const paymentNonce = {
            details: 'payment details',
            description: 'payment made using the card ending in xxxx',
            type: 'visa',
            bin: {
                code: 'some bin data'
            }
        };
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentSuccess(paymentNonce);

        const paymentNonceSaveCall = writeQuery.mock.calls.filter(
            call => call[0].query === getPaymentNonceQuery
        )[0];

        expect(paymentNonceSaveCall[0].data.cart.paymentNonce).toMatchObject({
            details: 'payment details',
            description: 'payment made using the card ending in xxxx',
            type: 'visa'
        });
    });

    test('Should call setCreditCardDetailsOnCartMutation on payment success', () => {
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        expect(setCreditCardDetailsOnCart).toHaveBeenCalledWith({
            variables: {
                cartId: '123',
                paymentMethod: 'braintree',
                paymentNonce: samplePaymentNonce.nonce
            }
        });
    });

    test('Should call onSuccess if setCreditCardDetailsOnCartMutation is successful', () => {
        setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
            jest.fn(),
            {
                called: true,
                loading: false,
                error: null
            }
        ]);

        const onSuccess = jest.fn();
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess,
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        expect(onSuccess).toHaveBeenCalled();
    });

    test('Should not call onSuccess if setCreditCardDetailsOnCartMutation is not successful', () => {
        setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
            jest.fn(),
            {
                called: true,
                loading: false,
                error: { graphQLErrors: [{ message: 'Some error' }] }
            }
        ]);

        const onSuccess = jest.fn();
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess,
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        expect(onSuccess).not.toHaveBeenCalled();
    });
});

describe('Testing stepNumber', () => {
    test('Should set stepNumber to 0 when onPaymentError is called', () => {
        const { talonProps, update } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        talonProps.onPaymentError();

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(0);
    });

    test('Should set stepNumber to 3 when onPaymentSuccess is called', () => {
        const { talonProps, update } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(3);
        expect(newTalonProps.isLoading).toBeTruthy();
    });

    test('Should set stepNumber to 0 when onPaymentReady is called', () => {
        const { talonProps, update } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentReady();

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(0);
        expect(newTalonProps.isLoading).toBeFalsy();
    });

    test('Should set stepNumber to 1 if shouldSubmit is set to true', () => {
        const { talonProps } = getTalonProps({
            shouldSubmit: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        expect(talonProps.stepNumber).toBe(1);
        expect(talonProps.isLoading).toBeTruthy();
    });

    test('Should set stepNumber to 2 if billing address mutation is successful', () => {
        setBillingAddressMutationResult.mockReturnValueOnce([
            () => {},
            {
                error: null,
                loading: false,
                called: true
            }
        ]);

        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        expect(talonProps.stepNumber).toBe(2);
        expect(talonProps.shouldRequestPaymentNonce).toBeTruthy();
        expect(talonProps.isLoading).toBeTruthy();
    });

    test('Should set stepNumber to 0 if billing address mutation failed', () => {
        setBillingAddressMutationResult.mockReturnValueOnce([
            () => {},
            {
                error: { graphQLErrors: ['some error'] },
                called: true,
                loading: false
            }
        ]);

        const resetShouldSubmit = jest.fn();
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit
        });

        expect(talonProps.stepNumber).toBe(0);
        expect(resetShouldSubmit).toBeCalled();
        expect(talonProps.shouldRequestPaymentNonce).toBeFalsy();
    });

    test('Should set stepNumber to 4 if payment method mutation is successful', () => {
        setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
            () => {},
            {
                called: true,
                loading: false,
                error: null
            }
        ]);

        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit: () => {}
        });

        expect(talonProps.stepNumber).toBe(4);
        expect(talonProps.isLoading).toBeTruthy();
    });

    test('Should set stepNumber to 0 if payment method mutation failed', () => {
        setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
            () => {},
            {
                called: true,
                loading: false,
                error: { graphQLErrors: ['some error'] }
            }
        ]);

        const resetShouldSubmit = jest.fn();
        const { talonProps } = getTalonProps({
            shouldSubmit: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetShouldSubmit
        });

        expect(talonProps.stepNumber).toBe(0);
        expect(resetShouldSubmit).toBeCalled();
        expect(talonProps.shouldRequestPaymentNonce).toBeFalsy();
    });
});
