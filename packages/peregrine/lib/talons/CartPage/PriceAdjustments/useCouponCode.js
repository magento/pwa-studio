import { useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCouponCode = props => {
    const {
        applyCouponMutation,
        getAppliedCouponsQuery,
        removeCouponMutation
    } = props;

    const [{ cartId }] = useCartContext();
    const [fetchAppliedCoupons, { data, error: fetchError }] = useLazyQuery(
        getAppliedCouponsQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        applyCoupon,
        { error: applyError, loading: applyingCoupon }
    ] = useMutation(applyCouponMutation);

    const [removeCoupon, { loading: removingCoupon }] = useMutation(
        removeCouponMutation
    );

    const handleApplyCoupon = useCallback(
        async ({ couponCode }) => {
            if (!couponCode) return;
            try {
                // Trim whitespace before submitting the coupon code
                await applyCoupon({
                    variables: {
                        cartId,
                        couponCode
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },
        [applyCoupon, cartId]
    );

    const handleRemoveCoupon = useCallback(
        async couponCode => {
            try {
                await removeCoupon({
                    variables: {
                        cartId,
                        couponCode
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },
        [cartId, removeCoupon]
    );

    useEffect(() => {
        if (cartId) {
            fetchAppliedCoupons({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchAppliedCoupons]);

    return {
        applyError,
        applyingCoupon,
        data,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    };
};
