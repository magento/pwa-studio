import { Magento2 } from '../../../RestApi';
import BrowserPersistence from '../../../util/simplePersistence';
import { closeDrawer } from '../app';
import { createCart, removeCart } from '../cart';
import actions from './actions';

const { request } = Magento2;
const storage = new BrowserPersistence();

export const beginCheckout = payload =>
    async function thunk(dispatch) {
        const { fetchCartId } = payload;
        const storedBillingAddress = storage.getItem('billing_address');
        const storedPaymentMethod = storage.getItem('paymentMethod');
        const storedShippingAddress = storage.getItem('shipping_address');
        const storedShippingMethod = storage.getItem('shippingMethod');

        dispatch(
            actions.begin({
                billingAddress: storedBillingAddress,
                paymentCode: storedPaymentMethod && storedPaymentMethod.code,
                paymentData: storedPaymentMethod && storedPaymentMethod.data,
                shippingAddress: storedShippingAddress,
                shippingMethod:
                    storedShippingMethod && storedShippingMethod.carrier_code,
                shippingTitle:
                    storedShippingMethod && storedShippingMethod.carrier_title
            })
        );
        dispatch(
            getShippingMethods({
                fetchCartId
            })
        );
    };

export const cancelCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.reset());
    };

export const resetCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(closeDrawer());
        await dispatch(removeCart());
        dispatch(actions.reset());
    };

export const resetReceipt = () =>
    async function thunk(dispatch) {
        await dispatch(actions.receipt.reset());
    };

export const getShippingMethods = payload => {
    return async function thunk(dispatch, getState) {
        const { fetchCartId } = payload;
        const { cart, user } = getState();
        const { cartId } = cart;

        try {
            // if there isn't a cart, create one then retry this operation
            if (!cartId) {
                await dispatch(
                    createCart({
                        fetchCartId
                    })
                );
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
                // if so, clear it out, get a new one and retry.
                await dispatch(removeCart());
                await dispatch(
                    createCart({
                        fetchCartId
                    })
                );
                return thunk(...arguments);
            }
        }
    };
};

export const submitPaymentMethodAndBillingAddress = payload =>
    async function thunk(dispatch) {
        const { countries, formValues } = payload;
        const { billingAddress, paymentMethod } = formValues;

        return Promise.all([
            dispatch(submitBillingAddress({ billingAddress, countries })),
            dispatch(submitPaymentMethod(paymentMethod))
        ]);
    };

export const submitBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.billingAddress.submit());

        const { cart } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        try {
            const { billingAddress, countries } = payload;

            let desiredBillingAddress = billingAddress;
            if (!billingAddress.sameAsShippingAddress) {
                desiredBillingAddress = formatAddress(
                    billingAddress,
                    countries
                );
            }

            await saveBillingAddress(desiredBillingAddress);

            dispatch(actions.billingAddress.accept(desiredBillingAddress));
        } catch (error) {
            dispatch(actions.billingAddress.reject(error));
            throw error;
        }
    };

export const submitPaymentMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.paymentMethod.submit());

        const { cart } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        try {
            await savePaymentMethod(payload);
            dispatch(actions.paymentMethod.accept(payload));
        } catch (error) {
            dispatch(actions.paymentMethod.reject(error));
            throw error;
        }
    };

export const submitShippingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingAddress.submit());

        const { cart } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        try {
            const address = formatAddress(
                payload.formValues,
                payload.countries
            );
            await saveShippingAddress(address);
            dispatch(actions.shippingAddress.accept(address));
        } catch (error) {
            dispatch(actions.shippingAddress.reject(error));
            throw error;
        }
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit());

        const { cart } = getState();
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        try {
            const desiredShippingMethod = payload.formValues.shippingMethod;
            await saveShippingMethod(desiredShippingMethod);
            dispatch(actions.shippingMethod.accept(desiredShippingMethod));
        } catch (error) {
            dispatch(actions.shippingMethod.reject(error));
            throw error;
        }
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
                actions.receipt.setOrder({
                    id: response,
                    billing_address
                })
            );

            // Clear out everything we've saved about this cart from local storage.
            await dispatch(removeCart());
            await clearCheckoutDataFromStorage();

            dispatch(actions.order.accept());
        } catch (error) {
            dispatch(actions.order.reject(error));
            throw error;
        }
    };

export const createAccount = history => async (dispatch, getState) => {
    const { checkout } = getState();

    const {
        email,
        firstname: firstName,
        lastname: lastName
    } = checkout.receipt.order.billing_address;

    const accountInfo = {
        email,
        firstName,
        lastName
    };

    await dispatch(resetCheckout());

    history.push(`/create-account?${new URLSearchParams(accountInfo)}`);
};

/* helpers */

/**
 * Formats an address in the shape the REST API expects.
 * TODO: Can we remove this code once address submissions switch to GraphQL?
 *
 * This function may throw.
 *
 * @param {object} address - The input address.
 * @param {object[]} countries - The list of countries data.
 */
export const formatAddress = (address = {}, countries = []) => {
    const { region_code } = address;

    const usa = countries.find(({ id }) => id === 'US');
    const { available_regions: regions } = usa;

    const region = regions.find(({ code }) => code === region_code);

    return {
        country_id: 'US',
        region_id: region.id,
        region_code: region.code,
        region: region.name,
        ...address
    };
};

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

export const clearCheckoutDataFromStorage = async () => {
    await clearBillingAddress();
    await clearPaymentMethod();
    await clearShippingAddress();
    await clearShippingMethod();
};
