import { RestApi } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { getGuestCartId } from 'src/actions/cart';
import * as durations from 'src/shared/durations';
import timeout from 'src/util/timeout';

const { request } = RestApi.Magento2;

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

const enterSubflow = (actionType, payload) =>
    async function thunk(dispatch) {
      dispatch({ type: actionType,
                 payload
               });
    };

const submitMockShippingAddress = () => async function thunk(dispatch) {
    try {
        const guestCartId = await getGuestCartId(...arguments);
        const payload = await request(
            `/rest/V1/guest-carts/${guestCartId}/shipping-information`,
            {
                method: 'POST',
                // TODO: replace with real data from cart state
                body: JSON.stringify({
                    addressInformation: {
                        billing_address: mockAddress,
                        shipping_address: mockAddress,
                        shipping_method_code: 'flatrate',
                        shipping_carrier_code: 'flatrate'
                    }
                })
            }
        );

    dispatch({ type: 'SUBMIT_SHIPPING_INFORMATION',
               payload
             });

    } catch (error) {
        dispatch({
            type: 'REJECT_SHIPPING_INFORMATION',
            payload: error,
            error: true
        });
    }
  }


const resetCheckout = () => async dispatch => {
    await closeDrawer()(dispatch);
    dispatch({ type: 'RESET_CHECKOUT' });
};

const requestOrder = () => async dispatch => {
    dispatch({ type: 'REQUEST_ORDER' });
    // TODO: replace with api call
    await timeout(durations.requestOrder);
    dispatch({ type: 'RECEIVE_ORDER' });
};

const submitOrder = () =>
    async function thunk(dispatch) {
        dispatch({ type: 'SUBMIT_ORDER' });

        try {
            const guestCartId = await getGuestCartId(...arguments);
            const payload = await request(
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

            dispatch({
                type: 'ACCEPT_ORDER',
                payload
            });
        } catch (error) {
            dispatch({
                type: 'REJECT_ORDER',
                payload: error,
                error: true
            });
        }
    };

export { enterSubflow, requestOrder, resetCheckout, submitOrder, submitMockShippingAddress };
