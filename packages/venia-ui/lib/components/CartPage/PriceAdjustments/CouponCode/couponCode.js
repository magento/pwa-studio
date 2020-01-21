import React, { useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import Button from '../../../Button';
import { mergeClasses } from '../../../../classify';
import defaultClasses from './couponCode.css';
import { Form } from 'informed';
import Field from '../../../Field';
import TextInput from '../../../TextInput';

import { AppliedCouponsFragment } from './couponCodeFragments';
import { CartPageFragment } from '../../cartPageFragments';

export const APPLY_COUPON_MUTATION = gql`
    mutation applyCouponToCart($cartId: String!, $couponCode: String!) {
        applyCouponToCart(
            input: { cart_id: $cartId, coupon_code: $couponCode }
        ) {
            cart {
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const REMOVE_COUPON_MUTATION = gql`
    mutation removeCouponFromCart($cartId: String!) {
        removeCouponFromCart(input: { cart_id: $cartId }) {
            cart {
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

const GET_APPLIED_COUPONS = gql`
    query getAppliedCoupons($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...AppliedCouponsFragment
        }
    }
    ${AppliedCouponsFragment}
`;

const CouponCode = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [{ cartId }] = useCartContext();
    const [fetchAppliedCoupons, { data, error: fetchError }] = useLazyQuery(
        GET_APPLIED_COUPONS,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        applyCoupon,
        { error: applyError, loading: applyingCoupon }
    ] = useMutation(APPLY_COUPON_MUTATION);
    const [removeCoupon, { loading: removingCoupon }] = useMutation(
        REMOVE_COUPON_MUTATION
    );

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
            await removeCoupon({
                variables: {
                    cartId,
                    couponCode
                }
            });
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

    if (!data) {
        return null;
    }

    if (fetchError) {
        console.log(fetchError);
        // TODO: Make this nicer
        return 'Something went wrong -- unable to retrieve applied coupons.';
    }

    let message = '';
    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <span className={classes.appliedCoupon} key={code}>
                    <span className={classes.code}>{code}</span>
                    <button
                        className={classes.removeButton}
                        disabled={removingCoupon}
                        onClick={() => {
                            handleRemoveCoupon(code);
                        }}
                    >
                        Remove
                    </button>
                </span>
            );
        });

        return <div className={classes.root}>{codes}</div>;
    } else {
        if (applyError) {
            message = 'An error occurred. Try again.';
        }
        return (
            <Form className={classes.entryForm} onSubmit={handleApplyCoupon}>
                <Field id="couponCode" label="Coupon Code">
                    <TextInput
                        field="couponCode"
                        id={'couponCode'}
                        placeholder={'Enter code'}
                        message={message}
                    />
                </Field>
                {/* TODO: Button alignment isn't correct. Fix it.*/}
                <Field>
                    <Button
                        classes={{ root_normalPriority: classes.applyButton }}
                        disabled={applyingCoupon}
                        priority={'normal'}
                        type={'submit'}
                    >
                        {'Apply'}
                    </Button>
                </Field>
            </Form>
        );
    }
};

export default CouponCode;
