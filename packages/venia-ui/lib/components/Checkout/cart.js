import React, { useCallback, useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';
import { useRestApi } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/state/User';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';
import { useCartContext } from '@magento/peregrine/lib/state/Cart';

const AUTHED_SHIPPING_METHOD_ENDPOINT =
    '/rest/V1/carts/mine/estimate-shipping-methods';
const AUTHED_CART_ENDPOINT = '/rest/V1/carts/mine';
const GUEST_CART_ENDPOINT = '/rest/V1/guest-carts';

const SHIPPING_METHOD_OPTIONS = {
    method: 'POST',
    body: JSON.stringify({
        address: {
            country_id: 'US',
            postcode: null
        }
    })
};

const CART_METHOD_OPTIONS = {
    method: 'POST'
};

const Cart = props => {
    const [cartState, cartApi] = useCartContext();
    const [userState] = useUserContext();
    const [checkoutState, checkoutApi] = useCheckoutContext();

    const [authedCartResponseState, authedCartRestApi] = useRestApi(
        AUTHED_CART_ENDPOINT
    );
    const [guestCartResponseState, guestCartRestApi] = useRestApi(
        GUEST_CART_ENDPOINT
    );

    useEffect(() => {
        if (!cartState.cartId) {
            if (userState.isSignedIn) {
                const { loading, data } = authedCartResponseState;
                if (!loading && !data) {
                    authedCartRestApi.sendRequest({
                        options: CART_METHOD_OPTIONS
                    });
                }
            } else {
                const { loading, data } = guestCartResponseState;
                if (!loading && !data) {
                    guestCartRestApi.sendRequest({
                        options: CART_METHOD_OPTIONS
                    });
                }
            }
        }
    }, [
        authedCartResponseState,
        authedCartRestApi,
        cartState.cartId,
        guestCartResponseState,
        guestCartRestApi,
        userState.isSignedIn
    ]);

    const cartData =
        authedCartResponseState.data || guestCartResponseState.data;

    useEffect(() => {
        if (cartData) {
            cartApi.setCartId(cartData);
        }
    }, [cartApi, cartData]);

    const [authedShippingResponseState, authedShippingRestApi] = useRestApi(
        AUTHED_SHIPPING_METHOD_ENDPOINT
    );
    const [guestShippingResponseState, guestShippingRestApi] = useRestApi(
        `/rest/V1/guest-carts/${cartState.cartId}/estimate-shipping-methods`
    );

    useEffect(() => {
        if (userState.isSignedIn) {
            const { loading, data } = authedShippingResponseState;
            if (!loading && !data) {
                authedShippingRestApi.sendRequest({
                    options: SHIPPING_METHOD_OPTIONS
                });
            }
        } else if (cartState.cartId) {
            const { loading, data } = guestShippingResponseState;
            if (!loading && !data) {
                guestShippingRestApi.sendRequest({
                    options: SHIPPING_METHOD_OPTIONS
                });
            }
        }
    }, [
        cartState.cartId,
        userState.isSignedIn,
        authedShippingRestApi,
        authedShippingResponseState,
        guestShippingRestApi,
        guestShippingResponseState
    ]);

    const shippingMethodData =
        authedShippingResponseState.data || guestShippingResponseState.data;

    useEffect(() => {
        if (shippingMethodData) {
            checkoutApi.setAvailableShippingMethods(shippingMethodData);
        }
    }, [checkoutApi, shippingMethodData]);

    const handleBeginCheckout = useCallback(async () => {
        checkoutApi.setCheckoutStateFromStorage();
    }, [checkoutApi]);

    const classes = mergeClasses(defaultClasses, props.classes);

    const disabled = checkoutState.submitting || !cartState.ready;

    return (
        <div className={classes.root}>
            <CheckoutButton disabled={disabled} onClick={handleBeginCheckout} />
        </div>
    );
};

Cart.propTypes = {
    beginCheckout: func.isRequired,
    classes: shape({
        root: string
    }),
    ready: bool.isRequired,
    submitting: bool.isRequired
};

export default Cart;
