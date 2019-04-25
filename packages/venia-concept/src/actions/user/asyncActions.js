import { RestApi } from '@magento/peregrine';
import { Util } from '@magento/peregrine';
import { refresh } from 'src/util/router-helpers';
import { getCartDetails, removeCart } from 'src/actions/cart';

import actions from './actions';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
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
    await clearToken();
    await dispatch(actions.signIn.reset());

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

export const createNewUserRequest = accountInfo =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetCreateAccountError.request());

        try {
            await request('/rest/V1/customers', {
                method: 'POST',
                body: JSON.stringify(accountInfo)
            });

            await dispatch(
                signIn({
                    username: accountInfo.customer.email,
                    password: accountInfo.password
                })
            );
        } catch (error) {
            dispatch(actions.createAccountError.receive(error));

            /*
             * Throw error again to notify async action which dispatched handleCreateAccount.
             */
            throw error;
        }
    };

export const createAccount = accountInfo => async dispatch => {
    /*
     * Server validation error is handled in handleCreateAccount.
     * We set createAccountError in Redux and throw error again
     * to notify redux-thunk action which dispatched handleCreateAccount action.
     */
    try {
        await dispatch(createNewUserRequest(accountInfo));
    } catch (e) {}
};

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetPassword.request(email));

        // TODO: actually make the call to the API.
        // For now, just return a resolved promise.
        const response = await Promise.resolve(email);

        dispatch(actions.resetPassword.receive(response));
    };

export const completePasswordReset = email => async dispatch =>
    dispatch(actions.completePasswordReset(email));

async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}

async function clearToken() {
    return storage.removeItem('signin_token');
}
