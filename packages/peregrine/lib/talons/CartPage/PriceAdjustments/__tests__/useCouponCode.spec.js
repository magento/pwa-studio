import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';
import { useCouponCode } from '../useCouponCode';

jest.mock('@apollo/react-hooks', () => {
    return {
        useLazyQuery: jest.fn(() => [jest.fn(), { data: null, error: null }]),
        useMutation: jest.fn(() => [jest.fn(), { data: null, error: null }])
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const api = {};
    const state = {
        cartId: 'abc123'
    };
    const useCartContext = jest.fn(() => [state, api]);
    return { useCartContext };
});

const log = jest.fn();
const Component = () => {
    const hookProps = useCouponCode({
        setIsCartUpdating: jest.fn(),
        queries: {},
        mutations: {}
    });

    log(hookProps);

    return null;
};

describe('#useCouponCode', () => {
    it('does not submit if no coupon provided', () => {
        const applyCouponMock = jest.fn();
        useMutation.mockReturnValueOnce([
            applyCouponMock,
            { error: null, loading: null }
        ]);

        const couponCode = '';

        createTestInstance(<Component />);
        const { handleApplyCoupon } = log.mock.calls[0][0];

        act(() => {
            handleApplyCoupon({ couponCode });
        });

        expect(applyCouponMock).not.toHaveBeenCalled();
    });

    it('submits provided coupon', () => {
        const applyCouponMock = jest.fn();
        useMutation.mockReturnValueOnce([
            applyCouponMock,
            { error: null, loading: null }
        ]);

        const couponCode = 'coupon_code';

        createTestInstance(<Component />);
        const { handleApplyCoupon } = log.mock.calls[0][0];

        act(() => {
            handleApplyCoupon({ couponCode });
        });

        expect(applyCouponMock).toHaveBeenCalledWith({
            variables: {
                cartId: expect.any(String),
                couponCode: couponCode
            }
        });
    });
});
