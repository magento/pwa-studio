import { RestApi, Util } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { clearCartId, createCart } from 'src/actions/cart';
import { getCountries } from 'src/actions/directory';
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

export const cancelCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.reset());
    };

export const resetCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(closeDrawer());
        await dispatch(createCart());
        dispatch(actions.reset());
    };

export const editOrder = section =>
    async function thunk(dispatch) {
        dispatch(actions.edit(section));
    };

export const getShippingMethods = () => {
    return async function thunk(dispatch, getState) {
        const { cart, user } = getState();
        const { cartId } = cart;

        try {
            // if there isn't a guest cart, create one
            // then retry this operation
            if (!cartId) {
                await dispatch(createCart());
                return thunk(...arguments);
            }

            dispatch(actions.getShippingMethods.request(cartId));

            const guestEndpoint = `/rest/V1/guest-carts/${cartId}/estimate-shipping-methods`;
            const authedEndpoint =
                '/rest/V1/carts/mine/estimate-shipping-methods';
            const endpoint = user.isSignedIn ? authedEndpoint : guestEndpoint;

            const response = await request(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    address: {
                        country_id: 'US',
                        postcode: null
                    }
                })
            });

            dispatch(actions.getShippingMethods.receive(response));
        } catch (error) {
            const { response } = error;

            dispatch(actions.getShippingMethods.receive(error));

            // check if the guest cart has expired
            if (response && response.status === 404) {
                // if so, clear it out, get a new one, and retry.
                await clearCartId();
                await dispatch(createCart());
                return thunk(...arguments);
            }
        }
    };
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

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
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

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        await savePaymentMethod(payload);
        dispatch(actions.paymentMethod.accept(payload));
    };

export const submitShippingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingAddress.submit(payload));

        const { cart, directory } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
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
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        const desiredShippingMethod = payload.formValues.shippingMethod;
        await saveShippingMethod(desiredShippingMethod);
        dispatch(actions.shippingMethod.accept(desiredShippingMethod));
    };

export const submitOrder = () =>
    async function thunk(dispatch, getState) {
        dispatch(actions.order.submit());

        const { cart, user } = getState();
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        let billing_address = await retrieveBillingAddress();
        const paymentMethod = await retrievePaymentMethod();
        const shipping_address = await retrieveShippingAddress();
        const shipping_method = await retrieveShippingMethod();

        if (billing_address.sameAsShippingAddress) {
            billing_address = shipping_address;
        } else {
            const { email, firstname, lastname, telephone } = shipping_address;

            billing_address = {
                email,
                firstname,
                lastname,
                telephone,
                ...billing_address
            };
        }

        try {
            // POST to shipping-information to submit the shipping address and shipping method.
            const guestShippingEndpoint = `/rest/V1/guest-carts/${cartId}/shipping-information`;
            const authedShippingEndpoint =
                '/rest/V1/carts/mine/shipping-information';
            const shippingEndpoint = user.isSignedIn
                ? authedShippingEndpoint
                : guestShippingEndpoint;

            await request(shippingEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    addressInformation: {
                        billing_address,
                        shipping_address,
                        shipping_carrier_code: shipping_method.carrier_code,
                        shipping_method_code: shipping_method.method_code
                    }
                })
            });

            // POST to payment-information to submit the payment details and billing address,
            // Note: this endpoint also actually submits the order.
            const guestPaymentEndpoint = `/rest/V1/guest-carts/${cartId}/payment-information`;
            const authedPaymentEndpoint =
                '/rest/V1/carts/mine/payment-information';
            const paymentEndpoint = user.isSignedIn
                ? authedPaymentEndpoint
                : guestPaymentEndpoint;

            const response = await request(paymentEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    billingAddress: billing_address,
                    cartId: cartId,
                    email: shipping_address.email,
                    paymentMethod: {
                        additional_data: {
                            payment_method_nonce: paymentMethod.data.nonce
                        },
                        method: paymentMethod.code
                    }
                })
            });

            dispatch(
                checkoutReceiptActions.setOrderInformation({
                    id: response,
                    billing_address
                })
            );

            // Clear out everything we've saved about this cart from local storage.
            await clearBillingAddress();
            await clearCartId();
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
    const { region_code } = address;
    const { available_regions: regions } = country;
    const region = regions.find(({ code }) => code === region_code);

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

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}
