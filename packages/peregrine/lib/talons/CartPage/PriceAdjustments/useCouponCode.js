import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCouponCode = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCouponMutation, removeCouponMutation },
        queries: { getAppliedCouponsQuery }
    } = props;

    const [{ cartId }] = useCartContext();

    const { data, error: fetchError } = useQuery(getAppliedCouponsQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: { cartId }
    });

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
        {
            called: removeCouponCalled,
            error: removeCouponError,
            loading: removingCoupon
        }
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
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
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
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, removeCoupon]
    );

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

    // Create a memoized error map and toggle individual errors when they change
    const errors = useMemo(
        () =>
            new Map([
                ['getAppliedCouponsQuery', fetchError],
                ['applyCouponMutation', applyError],
                ['removeCouponMutation', removeCouponError]
            ]),
        [applyError, fetchError, removeCouponError]
    );

    return {
        applyingCoupon,
        data,
        errors,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    };
};
