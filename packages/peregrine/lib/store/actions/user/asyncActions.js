import { Magento2 } from '../../../RestApi';
import BrowserPersistence from '../../../util/simplePersistence';
import { refresh } from '../../../util/router-helpers';
import { getCartDetails, removeCart } from '../cart';
import { clearCheckoutDataFromStorage } from '../checkout';

import actions from './actions';

const { request } = Magento2;
const storage = new BrowserPersistence();

export const signIn = credentials =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.signIn.request());

        try {
            const body = {
                username: credentials.username,
                password: credentials.password
            };

            const response = await request(
                '/rest/V1/integration/customer/token',
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                }
            );

            setToken(response);

            await dispatch(actions.signIn.receive(response));

            // Now that we're signed in, get this user's details.
            dispatch(getUserDetails());

            // Now that we're signed in, forget the old (guest) cart
            // and fetch this customer's cart.
            await dispatch(removeCart());
            dispatch(getCartDetails({ forceRefresh: true }));
        } catch (error) {
            dispatch(actions.signIn.receive(error));
        }
    };

export const signOut = ({ history }) => async dispatch => {
    // Sign the user out in local storage and Redux.
    await dispatch(clearToken());
    await dispatch(actions.reset());
    await clearCheckoutDataFromStorage();

    // Now that we're signed out, forget the old (customer) cart
    // and fetch a new guest cart.
    await dispatch(removeCart());
    dispatch(getCartDetails({ forceRefresh: true }));

    // Finally, go back to the first page of the browser history.
    refresh({ history });
};

export const getUserDetails = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            dispatch(actions.getDetails.request());

            try {
                const userDetails = await request('/rest/V1/customers/me', {
                    method: 'GET'
                });

                dispatch(actions.getDetails.receive(userDetails));
            } catch (error) {
                dispatch(actions.getDetails.receive(error));
            }
        }
    };

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetPassword.request());

        // TODO: actually make the call to the API.
        // For now, just return a resolved promise.
        await Promise.resolve(email);

        dispatch(actions.resetPassword.receive());
    };

export const setToken = token =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Store token in local storage.
        // TODO: Get correct token expire time from API
        storage.setItem('signin_token', token, 3600);

        // Persist in store
        dispatch(actions.setToken(token));
    };

export const clearToken = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Clear token from local storage
        storage.removeItem('signin_token');

        // Remove from store
        dispatch(actions.clearToken());
    };
