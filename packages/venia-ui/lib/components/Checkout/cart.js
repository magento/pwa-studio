import React, { useEffect } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';
import { useRestApi } from '@magento/peregrine';
// import { useUserContext } from '@magento/peregrine/lib/state/User';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';
// import { useCartContext } from '@magento/peregrine/lib/state/Cart';
import { useDirectoryContext } from '@magento/peregrine/lib/state/Directory';

const AUTHED_SHIPPING_METHOD_ENDPOINT =
    '/rest/V1/carts/mine/estimate-shipping-methods';
const COUNTRIES_ENDPOINT = '/rest/V1/directory/countries';

const SHIPPING_METHOD_OPTIONS = {
    method: 'POST',
    body: JSON.stringify({
        address: {
            country_id: 'US',
            postcode: null
        }
    })
};

const isCartReady = cart => cart.details && cart.details.items_count > 0;

const isCheckoutReady = (cartState, checkoutState, directoryState) => {
    const hasCountries = !!directoryState.countries;
    const hasShippingMethods = checkoutState.availableShippingMethods.length;
    return hasCountries && hasShippingMethods && isCartReady(cartState);
};
const Cart = props => {
    const { cart: cartState, user: userState } = props;
    // TODO: Use new state when we migrate cart and user over.
    // const [userState] = useUserContext();
    const [, cartApi] = useCartContext();
    const [checkoutState, checkoutApi] = useCheckoutContext();
    const [directoryState, directoryApi] = useDirectoryContext();

    const { cartId } = cartState;
    const { isSignedIn } = userState;

    cartApi.createCart(isSignedIn);

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
    })
};

export default Cart;
