import React, { useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';
import { useRestApi } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/state/User';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';
import { useCartContext } from '@magento/peregrine/lib/state/Cart';
import { useDirectoryContext } from '@magento/peregrine/lib/state/Directory';

const AUTHED_SHIPPING_METHOD_ENDPOINT =
    '/rest/V1/carts/mine/estimate-shipping-methods';
const AUTHED_CART_ENDPOINT = '/rest/V1/carts/mine';
const COUNTRIES_ENDPOINT = '/rest/V1/directory/countries';
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

// const isCartReady = cart => cart.details && cart.details.items_count > 0;

const isCheckoutReady = (cartState, checkoutState, directoryState) => {
    const hasCountries = !!directoryState.countries;
    const hasShippingMethods = checkoutState.availableShippingMethods.length;
    return hasCountries && hasShippingMethods;
    // TODO Add to check once cartState is migrated
    // && isCartReady(cartState);
};
const Cart = props => {
    const [userState] = useUserContext();
    const [cartState, cartApi] = useCartContext();
    const [checkoutState, checkoutApi] = useCheckoutContext();
    const [directoryState, directoryApi] = useDirectoryContext();

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

    const [countriesResponseState, countriesRequestApi] = useRestApi(
        COUNTRIES_ENDPOINT
    );
    const {
        data: countriesData,
        loading: countriesLoading
    } = countriesResponseState;

    // fetch countries/directory if necessary
    useEffect(() => {
        if (!countriesData && !countriesLoading) {
            countriesRequestApi.sendRequest();
        }
    }, [countriesData, countriesLoading, countriesRequestApi]);

    useEffect(() => {
        if (countriesData) {
            directoryApi.setCountries(countriesData);
        }
    }, [countriesData, directoryApi]);

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
            // TODO: Figure out why estimate-shipping-methods is returning empty array
            // checkoutApi.setAvailableShippingMethods(shippingMethodsData);
            checkoutApi.setAvailableShippingMethods([
                {
                    carrier_code: 'flatrate',
                    method_code: 'flatrate',
                    carrier_title: 'Flat Rate',
                    method_title: 'Fixed',
                    amount: 5,
                    base_amount: 5,
                    available: true,
                    error_message: '',
                    price_excl_tax: 5,
                    price_incl_tax: 5
                }
            ]);
        }
    }, [checkoutApi, shippingMethodsData]);

    const classes = mergeClasses(defaultClasses, props.classes);

    const disabled = !isCheckoutReady(cartState, checkoutState, directoryState);

    return (
        <div className={classes.root}>
            <CheckoutButton disabled={disabled} onClick={props.beginCheckout} />
        </div>
    );
};

Cart.propTypes = {
    beginCheckout: func.isRequired,
    classes: shape({
        root: string
    }),
    submitting: bool.isRequired
};

export default Cart;
