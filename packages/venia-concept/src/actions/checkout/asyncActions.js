import { RestApi, Util } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { clearGuestCartId, getShippingMethods } from 'src/actions/cart';
import { getCountries } from 'src/actions/directory';
import { getOrderInformation } from 'src/selectors/cart';
import { getAccountInformation } from 'src/selectors/checkoutReceipt';
import checkoutReceiptActions from 'src/actions/checkoutReceipt';
import actions from './actions';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

// Use the "flatrate" shipping method as the default.
export const DEFAULT_SHIPPING_METHOD = {
    amount: 5,
    available: true,
    base_amount: 5,
    carrier_code: 'flatrate',
    carrier_title: 'Flat Rate',
    code: 'flatrate',
    error_message: '',
    method_code: 'flatrate',
    method_title: 'Fixed',
    price_excl_tax: 5,
    price_incl_tax: 5,
    title: 'Flat Rate'
};

export const beginCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.begin());
        dispatch(getShippingMethods());
        dispatch(getCountries());
    };

export const cancelCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.reset());
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

        let desiredBillingAddress = payload;
        if (!payload.sameAsShippingAddress) {
            const { countries } = directory;
            try {
                desiredBillingAddress = formatAddress(payload, countries);
            } catch (error) {
                dispatch(actions.billingAddress.reject(error));
                return;
            }
        }

        await saveBillingAddress(desiredBillingAddress);
        dispatch(actions.billingAddress.accept(desiredBillingAddress));
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
        dispatch(actions.shippingAddress.accept(address));
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit(payload));

        const { cart } = getState();
        const { guestCartId } = cart;
        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        const desiredShippingMethod = payload.formValues.shippingMethod;
        await saveShippingMethod(desiredShippingMethod);
        dispatch(actions.shippingMethod.accept(desiredShippingMethod));
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
        const shipping_method = await retrieveShippingMethod();

        if (billing_address.sameAsShippingAddress) {
            billing_address = shipping_address;
        } else {
            billing_address = {
                ...shipping_address,
                ...billing_address
            };
        }

        try {
            // POST to shipping-information to submit the shipping address and shipping method.
            await request(
                `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            billing_address,
                            shipping_address,
                            shipping_carrier_code: shipping_method.carrier_code,
                            shipping_method_code: shipping_method.method_code
                        }
                    })
                }
            );

            // POST to payment-information to submit the payment details and billing address,
            // Note: this endpoint also actually submits the order.
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

async function retrieveShippingMethod() {
    return storage.getItem('shippingMethod');
}

export async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}
