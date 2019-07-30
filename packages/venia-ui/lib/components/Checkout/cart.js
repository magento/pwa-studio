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
    const [userState] = useUserContext();
    const [cartState, cartApi] = useCartContext();
    const [checkoutState, checkoutApi] = useCheckoutContext();

    const { cartId } = cartState;
    const { isSignedIn } = userState;

    const cartEndpoint = isSignedIn
        ? AUTHED_CART_ENDPOINT
        : GUEST_CART_ENDPOINT;
    const [cartResponseState, cartRequestApi] = useRestApi(cartEndpoint);
    const { data: cartData } = cartResponseState;

    const shippingMethodsEndpoint = isSignedIn
        ? AUTHED_SHIPPING_METHOD_ENDPOINT
        : `/rest/V1/guest-carts/${cartId}/estimate-shipping-methods`;
    const [
        shippingMethodsResponseState,
        shippingMethodsRequestApi
    ] = useRestApi(shippingMethodsEndpoint);
    const { data: shippingMethodsData } = shippingMethodsResponseState;

    // create a cart if necessary
    useEffect(() => {
        if (!cartId) {
            const { data, loading } = cartResponseState;

            if (!loading && !data) {
                cartRequestApi.sendRequest({
                    options: CART_METHOD_OPTIONS
                });
            }
        }
    }, [
        cartId,
        cartRequestApi,
        cartRequestApi.sendRequest,
        cartResponseState,
        cartResponseState.data,
        cartResponseState.loading,
        isSignedIn
    ]);

    // write cart contents to client cart state
    useEffect(() => {
        if (cartData) {
            cartApi.setCartId(cartData);
        }
    }, [cartApi, cartData]);

    // fetch shipping methods
    useEffect(() => {
        if (isSignedIn || cartId) {
            const { data, loading } = shippingMethodsResponseState;

            if (!loading && !data) {
                shippingMethodsRequestApi.sendRequest({
                    options: SHIPPING_METHOD_OPTIONS
                });
            }
        }
    }, [
        cartId,
        isSignedIn,
        shippingMethodsRequestApi,
        shippingMethodsRequestApi.sendRequest,
        shippingMethodsResponseState,
        shippingMethodsResponseState.data,
        shippingMethodsResponseState.loading
    ]);

    // write shipping methods to client checkout state
    useEffect(() => {
        if (shippingMethodsData) {
            checkoutApi.setAvailableShippingMethods(shippingMethodsData);
        }
    }, [checkoutApi, shippingMethodsData]);

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
