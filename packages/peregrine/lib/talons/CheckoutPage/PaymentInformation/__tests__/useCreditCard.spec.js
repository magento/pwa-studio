import React from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';
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
    firstName: '',
    lastName: '',
    country: {
        code: ''
    },
    street: ['', ''],
    city: '',
    region: { code: '' },
    postalCode: '',
    phoneNumber: ''
};
const shippingAddress = {
    firstName: '',
    lastName: '',
    country: {
        code: ''
    },
    street: ['', ''],
    city: '',
    region: { code: '' },
    postalCode: '',
    phoneNumber: ''
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

jest.mock('@apollo/react-hooks', () => {
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
        }
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
        updateButtonClicked: false,
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
        updateButtonClicked: false,
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
    const { talonProps } = getTalonProps({
        updateButtonClicked: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError,
        onReady: () => {}
    });

    talonProps.onPaymentError(error);

    expect(onError).toHaveBeenCalledWith(error);
});

test('Should return errors from billing address and payment method mutations', () => {
    setBillingAddressMutationResult.mockReturnValueOnce([
        () => {},
        {
            loading: false,
            called: true,
            error: {
                graphQLErrors: [
                    { message: 'some billing address mutation error' }
                ]
            }
        }
    ]);
    setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
        () => {},
        {
            loading: false,
            called: true,
            error: {
                graphQLErrors: [
                    { message: 'some payment method mutation error' }
                ]
            }
        }
    ]);

    const { talonProps } = getTalonProps({
        updateButtonClicked: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetUpdateButtonClicked: () => {}
    });

    expect(talonProps.errors.length).toBe(2);
    expect(talonProps.errors).toContain('some billing address mutation error');
    expect(talonProps.errors).toContain('some payment method mutation error');
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
        updateButtonClicked: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetUpdateButtonClicked: () => {}
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
        updateButtonClicked: false,
        queries,
        mutations,
        onSuccess: () => {},
        onError: () => {},
        onReady: () => {},
        resetUpdateButtonClicked: () => {}
    });

    expect(talonProps.initialValues).toMatchObject({
        isBillingAddressSame: true
    });
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
            state: 'test value',
            postalCode: 'test value',
            phoneNumber: 'test value'
        };
        useFormState
            .mockReturnValueOnce({
                values: {
                    ...billingAddress,
                    isBillingAddressSame: false
                }
            })
            .mockReturnValueOnce({
                values: {
                    ...billingAddress,
                    isBillingAddressSame: false
                }
            });

        getTalonProps({
            updateButtonClicked: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
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
            }
        });

        getTalonProps({
            updateButtonClicked: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
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
            }
        });

        getTalonProps({
            updateButtonClicked: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        const isBillingAddressSameSaveCall = writeQuery.mock.calls.filter(
            call => call[0].query === getIsBillingAddressSameQuery
        )[0];

        expect(
            isBillingAddressSameSaveCall[0].data.cart.isBillingAddressSame
        ).toBeTruthy();
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
            updateButtonClicked: false,
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
            updateButtonClicked: false,
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
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess,
            onReady: () => {},
            onError: () => {},
            resetUpdateButtonClicked: () => {}
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
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess,
            onReady: () => {},
            onError: () => {},
            resetUpdateButtonClicked: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        expect(onSuccess).not.toHaveBeenCalled();
    });
});

describe('Testing stepNumber', () => {
    test('Should set stepNumber to 0 when onPaymentError is called', () => {
        const { talonProps, update } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentError();

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(0);
    });

    test('Should set stepNumber to 5 when onPaymentSuccess is called', () => {
        const { talonProps, update } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentSuccess(samplePaymentNonce);

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(5);
    });

    test('Should set stepNumber to 0 when onPaymentReady is called', () => {
        const { talonProps, update } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        talonProps.onPaymentReady();

        const newTalonProps = update();

        expect(newTalonProps.stepNumber).toBe(0);
    });

    test('Should set stepNumber to 1 if updateButtonClicked is set to true', () => {
        const { talonProps } = getTalonProps({
            updateButtonClicked: true,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        expect(talonProps.stepNumber).toBe(1);
    });

    test('Should set stepNumber to 3 if billing address mutation is successful', () => {
        setBillingAddressMutationResult.mockReturnValueOnce([
            () => {},
            {
                error: null,
                loading: false,
                called: true
            }
        ]);

        const { talonProps } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {}
        });

        expect(talonProps.stepNumber).toBe(3);
        expect(talonProps.shouldRequestPaymentNonce).toBeTruthy();
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

        const resetUpdateButtonClicked = jest.fn();
        const { talonProps } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetUpdateButtonClicked
        });

        expect(talonProps.stepNumber).toBe(0);
        expect(resetUpdateButtonClicked).toBeCalled();
        expect(talonProps.shouldRequestPaymentNonce).toBeFalsy();
    });

    test('Should set stepNumber to 7 if payment method mutation is successful', () => {
        setCreditCardDetailsOnCartMutationResult.mockReturnValueOnce([
            () => {},
            {
                called: true,
                loading: false,
                error: null
            }
        ]);

        const { talonProps } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetUpdateButtonClicked: () => {}
        });

        expect(talonProps.stepNumber).toBe(7);
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

        const resetUpdateButtonClicked = jest.fn();
        const { talonProps } = getTalonProps({
            updateButtonClicked: false,
            queries,
            mutations,
            onSuccess: () => {},
            onReady: () => {},
            onError: () => {},
            resetUpdateButtonClicked
        });

        expect(talonProps.stepNumber).toBe(0);
        expect(resetUpdateButtonClicked).toBeCalled();
        expect(talonProps.shouldRequestPaymentNonce).toBeFalsy();
    });
});
