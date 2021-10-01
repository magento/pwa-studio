import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';
import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';

jest.mock('@apollo/client', () => {
    return {
        useQuery: jest.fn(() => ({ data: null, error: null })),
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

jest.mock('../CouponCode/couponCode.gql', () => ({
    getAppliedCouponsQuery: 'getAppliedCouponsQuery',
    applyCouponMutation: 'applyCouponMutation',
    removeCouponMutation: 'removeCouponMutation'
}));

const setIsCartUpdating = jest.fn();
const log = jest.fn();
const Component = () => {
    const hookProps = useCouponCode({
        setIsCartUpdating: setIsCartUpdating
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

    it('removes provided coupon', () => {
        const removeCouponMock = jest.fn();
        useMutation
            .mockReturnValueOnce([jest.fn(), { error: null, loading: null }])
            .mockReturnValueOnce([
                removeCouponMock,
                { error: null, loading: null }
            ])
            .mockReturnValueOnce([jest.fn(), { error: null, loading: null }])
            .mockReturnValueOnce([
                removeCouponMock,
                { error: null, loading: true, called: true }
            ]);

        const couponCode = 'coupon_code';

        const component = createTestInstance(<Component />);

        const { handleRemoveCoupon } = log.mock.calls[0][0];

        act(() => {
            handleRemoveCoupon(couponCode);
        });

        expect(removeCouponMock).toHaveBeenCalledWith({
            variables: {
                cartId: expect.any(String),
                couponCode: couponCode
            }
        });

        // Re-render component to get loading state
        act(() => {
            component.update(<Component />);
        });

        expect(setIsCartUpdating).toHaveBeenCalledWith(true);
    });
});

test('returns applyCoupon error message', () => {
    const errorResult = new Error('applyCoupon Error');
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            error: errorResult
        }
    ]);

    createTestInstance(<Component />);
    const { errors } = log.mock.calls[0][0];

    expect(errors.get('applyCouponMutation')).toEqual(errorResult);
});

test('returns removeCoupon error', () => {
    const errorResult = new Error('removeCoupon Error');
    useMutation
        .mockReturnValueOnce([
            jest.fn(),
            {
                error: undefined
            }
        ])
        .mockReturnValueOnce([
            jest.fn(),
            {
                error: errorResult
            }
        ]);

    createTestInstance(<Component />);
    const { errors } = log.mock.calls[0][0];

    expect(errors.get('removeCouponMutation')).toEqual(errorResult);
});
