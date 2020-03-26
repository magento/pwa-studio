import { useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCouponCode = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCouponMutation, removeCouponMutation },
        queries: { getAppliedCouponsQuery }
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
        {
            called: applyCouponCalled,
            error: applyError,
            loading: applyingCoupon
        }
    ] = useMutation(applyCouponMutation);

    const [
        removeCoupon,
        { called: removeCouponCalled, loading: removingCoupon }
    ] = useMutation(removeCouponMutation);

    const handleApplyCoupon = useCallback(
        async ({ couponCode }) => {
            if (!couponCode) return;
            try {
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

    useEffect(() => {
        if (applyCouponCalled || removeCouponCalled) {
            // If a coupon mutation is in flight, tell the cart.
            setIsCartUpdating(applyingCoupon || removingCoupon);
        }
    }, [
        applyCouponCalled,
        applyingCoupon,
        removeCouponCalled,
        removingCoupon,
        setIsCartUpdating
    ]);

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
