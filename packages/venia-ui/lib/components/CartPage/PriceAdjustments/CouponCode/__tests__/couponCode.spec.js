import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CouponCode from '../couponCode';
import { useQuery, useMutation } from '@apollo/client';

const mockAddToast = jest.fn();
jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: mockAddToast }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

jest.mock('@apollo/client', () => {
    const runMutation = jest.fn();
    const queryResult = {
        data: {
            cart: {
                id: 'cartId',
                applied_coupons: null
            }
        },
        error: null,
        loading: false
    };

    const mutationResult = {
        error: null,
        loading: false
    };

    const useQuery = jest.fn(() => queryResult);
    const useMutation = jest.fn(() => [runMutation, mutationResult]);

    return {
        gql: jest.fn(),
        useQuery,
        useMutation
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const defaultProps = {
    classes: {
        applyButton: 'applybutton',
        appliedCoupon: 'appliedCoupon',
        entryForm: 'entryForm',
        removeButton: 'removeButton'
    }
};

test('renders nothing if no data is returned', () => {
    useQuery.mockReturnValueOnce({
        data: null
    });

    const tree = createTestInstance(<CouponCode {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders an error state if unable to fetch applied coupons', () => {
    useQuery.mockReturnValueOnce({
        data: {},
        error: true
    });

    const tree = createTestInstance(<CouponCode {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders CouponCode input and submit button', () => {
    const instance = createTestInstance(<CouponCode {...defaultProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('disables submit button on coupon entry', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            loading: true
        }
    ]);

    const instance = createTestInstance(<CouponCode {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders an error message if an error occurs on code entry', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            error: {
                graphQLErrors: [{ message: 'A wild GQL error appeared!' }]
            }
        }
    ]);
    const instance = createTestInstance(<CouponCode {...defaultProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders the coupon code view if applied coupons has data', () => {
    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                applied_coupons: [
                    {
                        code: 'COUPON'
                    }
                ]
            }
        }
    });
    const instance = createTestInstance(<CouponCode {...defaultProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('disables remove button on click', () => {
    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                applied_coupons: [
                    {
                        code: 'COUPON'
                    }
                ]
            }
        }
    });

    // Mock the click of the remove button
    useMutation
        .mockReturnValueOnce([
            jest.fn(),
            {
                loading: false
            }
        ])
        .mockReturnValueOnce([
            jest.fn(),
            {
                loading: true
            }
        ]);

    const instance = createTestInstance(<CouponCode {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
