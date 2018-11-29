import { RestApi } from '@magento/peregrine';

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

export const beginCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.begin());
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
        await dispatch(getCountries());

        const { cart, directory } = getState();
        const { guestCartId } = cart;
        const { countries } = directory;
        let { formValues: address } = payload;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        try {
            address = formatAddress(address, countries);
        } catch (error) {
            throw error;
        }

        try {
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            billing_address: address,
                            shipping_address: address,
                            shipping_method_code: 'flatrate',
                            shipping_carrier_code: 'flatrate'
                        }
                    })
                }
            );

            // TODO: we may not actually want to do this here,
            // but once we have POSTed our shipping information
            // we can fetch the available shipping methods.
            await dispatch(getShippingMethods());

            // refresh cart before returning to checkout overview
            // to avoid flash of old data and layout thrashing
            await dispatch(getCartDetails({ forceRefresh: true }));
            dispatch(actions.address.accept(response));
        } catch (error) {
            dispatch(actions.address.reject(error));
        }
    };

export const submitPaymentMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.paymentMethod.submit(payload));

        const desiredPaymentMethod = payload.formValues.paymentMethod;

        const { cart, directory } = getState();
        const { guestCartId } = cart;
        const billingAddress = cart.details.billing_address;
        const { countries } = directory;

        // If we were able to skip submitting an address (ex: this cart already had one),
        // we must be sure to fetch the countries so we can format the billing address.
        if (!countries) {
            await dispatch(getCountries());
            // then retry this operation
            return thunk(...arguments);
        }

        let address;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        try {
            address = formatAddress(billingAddress, countries);
        } catch (error) {
            throw error;
        }

        try {
            await request(
                `/rest/V1/guest-carts/${guestCartId}/set-payment-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        billingAddress: address,
                        email: address.email,
                        paymentMethod: {
                            method: desiredPaymentMethod.code
                        }
                    })
                }
            );

            // If we don't have shipping methods yet, we need to fetch them now.
            if (!cart.shippingMethods) {
                await dispatch(getShippingMethods());
            }

            dispatch(actions.paymentMethod.accept(desiredPaymentMethod));
        } catch (error) {
            dispatch(actions.paymentMethod.reject(error));
        }
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit(payload));

        const desiredShippingMethod = payload.formValues.shippingMethod;

        const { cart, checkout } = getState();
        const { guestCartId } = cart;
        const { paymentMethod } = checkout;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        try {
            await request(
                `/rest/V1/guest-carts/${guestCartId}/collect-totals`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        paymentMethod: {
                            method: paymentMethod
                        },
                        shippingCarrierCode: desiredShippingMethod.carrier_code,
                        shippingMethodCode: desiredShippingMethod.method_code
                    })
                }
            );

            // TODO: also update the total price from the response
            dispatch(actions.shippingMethod.accept(desiredShippingMethod));
        } catch (error) {
            dispatch(actions.shippingMethod.reject(error));
        }
    };

export const submitOrder = () =>
    async function thunk(dispatch, getState) {
        dispatch(actions.order.submit());

        const { cart, checkout } = getState();
        const { guestCartId } = cart;
        const { paymentMethod } = checkout;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        try {
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/order`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        paymentMethod: {
                            method: paymentMethod
                        }
                    })
                }
            );

            dispatch(
                checkoutReceiptActions.setOrderInformation(
                    getOrderInformation(getState(), response)
                )
            );

            dispatch(actions.order.accept(response));
            clearGuestCartId();
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
        throw new Error(`Region "${region_code}" is not an available region.`);
    }

    return {
        country_id: 'US',
        region_id: region.id,
        region_code: region.code,
        region: region.name,
        ...address
    };
}
