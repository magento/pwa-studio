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

export const submitPaymentMethodAndBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        submitBillingAddress(payload.formValues.billingAddress)(
            dispatch,
            getState
        );
        submitPaymentMethod(payload.formValues.paymentMethod)(
            dispatch,
            getState
        );
    };

export const submitBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.billingAddress.submit(payload));

        const { cart, directory } = getState();

        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        let desiredBillingAddress;
        if (payload.sameAsShippingAddress) {
            const shippingAddress = await retrieveShippingAddress();
            desiredBillingAddress = {
                ...payload,
                ...shippingAddress
            };
        } else {
            const { countries } = directory;
            try {
                desiredBillingAddress = formatAddress(payload, countries);
            } catch (error) {
                dispatch(actions.billingAddress.reject(error));
                return;
            }
        }

        await saveBillingAddress(desiredBillingAddress);
        dispatch(actions.billingAddress.accept());
    };

export const submitShippingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingAddress.submit(payload));

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
                actions.shippingAddress.reject({
                    incorrectAddressMessage: error.message
                })
            );
            return null;
        }

        await saveShippingAddress(address);
        dispatch(actions.shippingAddress.accept());
    };

export const submitPaymentMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.paymentMethod.submit(payload));

        const { cart } = getState();

        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        await savePaymentMethod(payload);
        dispatch(actions.paymentMethod.accept(payload));
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit(payload));

        const { cart } = getState();
        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        let billing_address = await retrieveBillingAddress();
        const desiredShippingMethod = payload.formValues.shippingMethod;
        const shipping_address = await retrieveShippingAddress();

        // Remove extranneous properties from the billing address because the
        // Magento backend will reject them.
        billing_address = removeInvalidKeysFromAddress(billing_address);

        try {
            await request(
                `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            billing_address,
                            shipping_address,
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

        let billing_address = await retrieveBillingAddress();
        const paymentMethod = await retrievePaymentMethod();
        const shipping_address = await retrieveShippingAddress();

        // Remove extranneous properties from the billing address because the
        // Magento backend will reject them.
        billing_address = removeInvalidKeysFromAddress(billing_address);

        try {
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/payment-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        billingAddress: billing_address,
                        cartId: guestCartId,
                        email: shipping_address.email,
                        paymentMethod: {
                            additional_data: {
                                payment_method_nonce: paymentMethod.data.nonce
                            },
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
            await clearBillingAddress();
            await clearGuestCartId();
            await clearPaymentMethod();
            await clearShippingAddress();
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

/**
 * When submitting addresses to the Magento backend, we must remove all
 * properties it doesn't recognize because it will reject the submission.
 *
 * @param {Object} address - an address object that may have extra properties.
 */
function removeInvalidKeysFromAddress(address) {
    const INVALID_ADDRESS_KEYS = ['sameAsShippingAddress'];

    const validAddress = {};
    const keysToKeep = Object.keys(address).filter(
        key => !INVALID_ADDRESS_KEYS.includes(key)
    );
    keysToKeep.forEach(key => (validAddress[key] = address[key]));

    return validAddress;
}

async function clearBillingAddress() {
    return storage.removeItem('billing_address');
}

async function retrieveBillingAddress() {
    return storage.getItem('billing_address');
}

async function saveBillingAddress(address) {
    return storage.setItem('billing_address', address);
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

async function clearShippingAddress() {
    return storage.removeItem('shipping_address');
}

async function retrieveShippingAddress() {
    return storage.getItem('shipping_address');
}

async function saveShippingAddress(address) {
    return storage.setItem('shipping_address', address);
}

async function clearShippingMethod() {
    return storage.removeItem('shippingMethod');
}

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}
