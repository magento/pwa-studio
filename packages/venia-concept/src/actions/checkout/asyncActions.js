import { RestApi, Util } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import {
    clearGuestCartId,
    getCartDetails,
    getShippingMethods
} from 'src/actions/cart';
import { getCountries } from 'src/actions/directory';
import { getOrderInformation } from 'src/selectors/cart';
import { getAccountInformation } from 'src/selectors/checkoutReceipt';
import checkoutReceiptActions from 'src/actions/checkoutReceipt';
import actions from './actions';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const beginCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.begin());
        dispatch(getShippingMethods());
        dispatch(getCountries());
    };

export const resetCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(closeDrawer());
        dispatch(actions.reset());
    };

export const editOrder = section =>
    async function thunk(dispatch) {
        dispatch(actions.edit(section));
    };

export const submitAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.address.submit(payload));

        const { cart, directory } = getState();

        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        const { countries } = directory;
        let { formValues: address } = payload;
        try {
            address = formatAddress(address, countries);
        } catch (error) {
            dispatch(
                actions.address.reject({
                    incorrectAddressMessage: error.message
                })
            );
            return null;
        }

        await saveAddress(address);
        dispatch(actions.address.accept());
    };

export const submitPaymentMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.paymentMethod.submit(payload));

        const { cart } = getState();

        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        const desiredPaymentMethod = payload.formValues.paymentMethod;

        await savePaymentMethod(desiredPaymentMethod);
        dispatch(actions.paymentMethod.accept(desiredPaymentMethod));
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit(payload));

        const { cart } = getState();
        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        const address = await retrieveAddress();
        const desiredShippingMethod = payload.formValues.shippingMethod;

        try {
            await request(
                `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            billing_address: address,
                            shipping_address: address,
                            shipping_carrier_code:
                                desiredShippingMethod.carrier_code,
                            shipping_method_code:
                                desiredShippingMethod.method_code
                        }
                    })
                }
            );

            // refresh cart before returning to checkout overview
            // to avoid flash of old data and layout thrashing
            await dispatch(getCartDetails({ forceRefresh: true }));

            await saveShippingMethod(desiredShippingMethod);

            dispatch(actions.shippingMethod.accept(desiredShippingMethod));
        } catch (error) {
            dispatch(actions.shippingMethod.reject(error));
        }
    };

export const submitOrder = () =>
    async function thunk(dispatch, getState) {
        dispatch(actions.order.submit());

        const { cart } = getState();
        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        const address = await retrieveAddress();
        const paymentMethod = await retrievePaymentMethod();

        try {
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/payment-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        billingAddress: address,
                        cartId: guestCartId,
                        email: address.email,
                        paymentMethod: {
                            method: paymentMethod.code
                        }
                    })
                }
            );

            dispatch(
                checkoutReceiptActions.setOrderInformation(
                    getOrderInformation(getState(), response)
                )
            );

            // Clear out everything we've saved about this cart from local storage.
            await clearGuestCartId();
            await clearAddress();
            await clearPaymentMethod();
            await clearShippingMethod();

            dispatch(actions.order.accept(response));
        } catch (error) {
            dispatch(actions.order.reject(error));
        }
    };

export const createAccount = history => async (dispatch, getState) => {
    const accountInfo = getAccountInformation(getState());

    await dispatch(resetCheckout());

    history.push(`/create-account?${new URLSearchParams(accountInfo)}`);
};

export const continueShopping = history => async dispatch => {
    await dispatch(resetCheckout());

    history.push('/');
};

/* helpers */

export function formatAddress(address = {}, countries = []) {
    const country = countries.find(({ id }) => id === 'US');

    if (!country) {
        throw new Error('Country "US" is not an available country.');
    }
    const { region_code } = address;
    const { available_regions: regions } = country;

    if (!(Array.isArray(regions) && regions.length)) {
        throw new Error('Country "US" does not contain any available regions.');
    }

    const region = regions.find(({ code }) => code === region_code);

    if (!region) {
        throw new Error(
            `State "${region_code}" is not an valid state abbreviation.`
        );
    }

    return {
        country_id: 'US',
        region_id: region.id,
        region_code: region.code,
        region: region.name,
        ...address
    };
}

async function clearAddress() {
    return storage.removeItem('address');
}

async function retrieveAddress() {
    return storage.getItem('address');
}

async function saveAddress(address) {
    return storage.setItem('address', address);
}

async function clearPaymentMethod() {
    return storage.removeItem('paymentMethod');
}

async function retrievePaymentMethod() {
    return storage.getItem('paymentMethod');
}

async function savePaymentMethod(method) {
    return storage.setItem('paymentMethod', method);
}

async function clearShippingMethod() {
    return storage.removeItem('shippingMethod');
}

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}
