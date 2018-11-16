import { RestApi } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { clearGuestCartId, getCartDetails } from 'src/actions/cart';
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

export const submitInput = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.input.submit(payload));
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

            // refresh cart before returning to checkout overview
            // to avoid flash of old data and layout thrashing
            await dispatch(getCartDetails({ forceRefresh: true }));
            dispatch(actions.input.accept(response));
        } catch (error) {
            dispatch(actions.input.reject(error));
        }
    };

export const submitOrder = () =>
    async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { guestCartId } = cart;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        dispatch(actions.order.submit());

        try {
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/order`,
                {
                    method: 'PUT',
                    // TODO: replace with real data from cart state
                    body: JSON.stringify({
                        paymentMethod: {
                            method: 'checkmo'
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
