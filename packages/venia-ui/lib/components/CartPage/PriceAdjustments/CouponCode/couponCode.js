import React, { Fragment } from 'react';

import gql from 'graphql-tag';

import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useCouponCode';
import { mergeClasses } from '../../../../classify';

import Button from '../../../Button';
import { Form } from 'informed';
import Field from '../../../Field';
import LinkButton from '../../../LinkButton';
import TextInput from '../../../TextInput';

import { CartPageFragment } from '../../cartPageFragments.gql';
import { AppliedCouponsFragment } from './couponCodeFragments';
import defaultClasses from './couponCode.css';

const GET_APPLIED_COUPONS = gql`
    query getAppliedCoupons($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...AppliedCouponsFragment
        }
    }
    ${AppliedCouponsFragment}
`;

const APPLY_COUPON_MUTATION = gql`
    mutation applyCouponToCart($cartId: String!, $couponCode: String!) {
        applyCouponToCart(
            input: { cart_id: $cartId, coupon_code: $couponCode }
        ) @connection(key: "applyCouponToCart") {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
`;

const REMOVE_COUPON_MUTATION = gql`
    mutation removeCouponFromCart($cartId: String!) {
        removeCouponFromCart(input: { cart_id: $cartId })
            @connection(key: "removeCouponFromCart") {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
`;

const CouponCode = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating,
        mutations: {
            applyCouponMutation: APPLY_COUPON_MUTATION,
            removeCouponMutation: REMOVE_COUPON_MUTATION
        },
        queries: {
            getAppliedCouponsQuery: GET_APPLIED_COUPONS
        }
    });

    const {
        applyingCoupon,
        data,
        errorMessage,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    } = talonProps;

    if (!data) {
        return null;
    }

    if (fetchError) {
        return (
            <div className={classes.errorContainer}>
                {'Something went wrong. Please refresh and try again.'}
            </div>
        );
    }

    const formClass = errorMessage ? classes.entryFormError : classes.entryForm;

    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <Fragment key={code}>
                    <span>{code}</span>
                    <LinkButton
                        className={classes.removeButton}
                        disabled={removingCoupon}
                        onClick={() => {
                            handleRemoveCoupon(code);
                        }}
                    >
                        Remove
                    </LinkButton>
                </Fragment>
            );
        });

        return <div>{codes}</div>;
    } else {
        return (
            <Form className={formClass} onSubmit={handleApplyCoupon}>
                <Field id="couponCode" label="Coupon Code">
                    <TextInput
                        field="couponCode"
                        id={'couponCode'}
                        placeholder={'Enter code'}
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        message={errorMessage}
                    />
                </Field>
                <Field>
                    <Button
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
