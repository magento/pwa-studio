import React from 'react';

import { useMutation } from '@apollo/client';
import createTestInstance from '../../../../../lib/util/createTestInstance';

import { useUserContext } from '../../../../context/user';
import { useCartContext } from '../../../../context/cart';
import { useAwaitQuery } from '../../../../hooks/useAwaitQuery';

import { useCreateAccount } from '../useCreateAccount';
import { act } from 'react-test-renderer';

jest.mock('@apollo/client');
jest.mock('../../../../context/user');
jest.mock('../../../../context/cart');
jest.mock('../../../../hooks/useAwaitQuery');

const mockCreateAccount = jest.fn();

const mockSignIn = jest.fn(() => {
    return {
        data: {
            generateCustomerToken: {
                token: 'signInToken'
            }
        }
    };
});
useMutation.mockImplementation(query => {
    let result = [jest.fn(), { error: null }];

    switch (query) {
        case 'createAccountMutation':
            result = [mockCreateAccount, { error: null }];
            break;
        case 'signInMutation':
            result = [mockSignIn, { error: null }];
            break;
    }

    return result;
});

const mockGetUserDetails = jest.fn();
const mockSetToken = jest.fn();
useUserContext.mockImplementation(() => {
    const data = {
        isGettingDetails: false
    };

    const api = {
        getUserDetails: mockGetUserDetails,
        setToken: mockSetToken
    };

    return [data, api];
});

const mockCreateCart = jest.fn();
const mockGetCartDetails = jest.fn();
const mockRemoveCart = jest.fn();
useCartContext.mockImplementation(() => {
    const data = {};
    const api = {
        createCart: mockCreateCart,
        getCartDetails: mockGetCartDetails,
        removeCart: mockRemoveCart
    };

    return [data, api];
});

useAwaitQuery.mockImplementation(jest.fn());

const handleSubmit = jest.fn();

const DEFAULT_PROPS = {
    initialValues: {
        email: 'philipfry@fake.email',
        firstName: 'Philip',
        lastName: 'Fry'
    },
    onSubmit: handleSubmit,
    operations: {
        createAccountMutation: 'createAccountMutation',
        createCartMutation: 'createCartMutation',
        getCartDetailsQuery: 'getCartDetailsQuery',
        getCustomerQuery: 'getCustomerQuery',
        signInMutation: 'signInMutation'
    }
};

const Component = props => {
    const talonProps = useCreateAccount(props);

    return <i talonProps={talonProps} />;
};

test('returns the correct shape', () => {
    const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns the correct shape with no initial values', () => {
    const tree = createTestInstance(
        <Component {...DEFAULT_PROPS} initialValues={undefined} />
    );

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

describe('handle submit event', () => {
    const formValues = {
        customer: {
            email: 'bender@fake.email',
            firstname: 'Bender',
            lastname: 'Rodriguez'
        },
        password: '123456',
        subscribe: false
    };

    it('creates an account, signs in, and generates a new cart', async () => {
        const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await act(async () => {
            await talonProps.handleSubmit(formValues);
        });

        const { talonProps: finalProps } = tree.root.findByType('i').props;

        expect(mockCreateAccount).toHaveBeenCalledWith({
            variables: {
                email: 'bender@fake.email',
                firstname: 'Bender',
                lastname: 'Rodriguez',
                password: '123456',
                is_subscribed: false
            }
        });
        expect(mockSignIn).toHaveBeenCalledWith({
            variables: {
                email: 'bender@fake.email',
                password: '123456'
            }
        });
        expect(mockSetToken).toHaveBeenCalledWith('signInToken');
        expect(mockRemoveCart).toHaveBeenCalled();
        expect(mockCreateCart).toHaveBeenCalledWith({
            fetchCartId: expect.anything()
        });
        expect(mockGetUserDetails).toHaveBeenCalled();
        expect(mockGetCartDetails).toHaveBeenCalled();
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(finalProps.isDisabled).toBeTruthy();
    });

    it('does not call the submit callback if it is not defined', async () => {
        const tree = createTestInstance(
            <Component {...DEFAULT_PROPS} onSubmit={undefined} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await act(async () => {
            await talonProps.handleSubmit(formValues);
        });

        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('resets the submitting state on error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');

        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isGettingDetails: false
                },
                {
                    getUserDetails: mockGetUserDetails,
                    setToken: jest.fn(() => {
                        throw new Error('Error setting token');
                    })
                }
            ];
        });
        const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await act(async () => {
            await talonProps.handleSubmit(formValues);
        });

        const { talonProps: finalProps } = tree.root.findByType('i').props;

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(finalProps.isDisabled).toBeFalsy();
    });

    it('does not log errors to console in production when an error happens', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        process.env.NODE_ENV = 'production';

        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isGettingDetails: false
                },
                {
                    getUserDetails: mockGetUserDetails,
                    setToken: jest.fn(() => {
                        throw new Error('Error setting token');
                    })
                }
            ];
        });
        const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await act(async () => {
            await talonProps.handleSubmit(formValues);
        });

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
