import { createActions } from 'redux-actions';
import { RestApi } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { clearGuestCartId, getCartDetails } from 'src/actions/cart';

const prefix = 'CHECKOUT';
const actionTypes = ['EDIT', 'RESET'];

// classify action creators by domain
// e.g., `actions.order.submit` => CHECKOUT/ORDER/SUBMIT
// a `null` value corresponds to the default creator function
const actionMap = {
    CART: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    INPUT: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    ORDER: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    }
};

const actions = createActions(actionMap, ...actionTypes, { prefix });
export default actions;

/* async action creators */

const { request } = RestApi.Magento2;

export const resetCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(closeDrawer());
        dispatch(actions.reset());
    };

export const editOrder = section =>
    async function thunk(dispatch) {
        dispatch(actions.edit(section));
    };

export const submitCart = () =>
    async function thunk(dispatch) {
        dispatch(actions.cart.accept());
    };

export const submitInput = () =>
    async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { guestCartId } = cart;

        if (!guestCartId) {
            throw new Error('Missing required information: guestCartId');
        }

        dispatch(actions.input.submit());

        try {
            const address = formatAddress();
            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
                {
                    method: 'POST',
                    // TODO: replace with real data from cart state
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

            dispatch(actions.input.accept(response));
            dispatch(getCartDetails({ forceRefresh: true }));
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

            dispatch(actions.order.accept(response));
            clearGuestCartId();
        } catch (error) {
            dispatch(actions.order.reject(error));
        }
    };

/* helpers */

const mockAddress = {
    country_id: 'US',
    firstname: 'Veronica',
    lastname: 'Costello',
    street: ['6146 Honey Bluff Parkway'],
    city: 'Calder',
    postcode: '49628-7978',
    region_id: 33,
    region_code: 'MI',
    region: 'Michigan',
    telephone: '(555) 229-3326',
    email: 'veronica@example.com'
};

function formatAddress(address = mockAddress) {
    return address;
}
