import { RestApi } from '@magento/peregrine';
import { Util } from '@magento/peregrine';
import { refresh } from 'src/util/router-helpers';
import { getCartDetails, removeGuestCart } from 'src/actions/cart';

import actions from './actions';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const signIn = credentials =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetSignInError.request());

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

            const userDetails = await request('/rest/V1/customers/me', {
                method: 'GET'
            });

            await dispatch(actions.signIn.receive(userDetails));

            // Now that we're signed in, forget the old guest cart
            // and fetch this customer's cart.
            await dispatch(removeGuestCart());
            dispatch(getCartDetails({ forceRefresh: true }));
        } catch (error) {
            dispatch(actions.signInError.receive(error));
        }
    };

export const signOut = ({ history }) => dispatch => {
    setToken(null);

    dispatch(actions.signIn.reset());

    refresh({ history });
};

export const getUserDetails = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            dispatch(actions.resetSignInError.request());

            try {
                const userDetails = await request('/rest/V1/customers/me', {
                    method: 'GET'
                });
                dispatch(actions.signIn.receive(userDetails));
            } catch (error) {
                dispatch(actions.signInError.receive(error));
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
    storage.setItem('signin_token', token, 3600);
}
