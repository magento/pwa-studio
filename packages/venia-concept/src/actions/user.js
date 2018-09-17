import { RestApi } from '@magento/peregrine';
import BrowserPersistence from 'src/util/simplePersistence.js';
import { removeGuestCart } from 'src/actions/cart';

const { request } = RestApi.Magento2;

const signIn = credentials =>
    async function thunk(...args) {
        const [dispatch] = args;

        const body = {
            // username: 'roni_cost@example.com',
            // password: 'roni_cost3@example.com'
            username: credentials.username,
            password: credentials.password
        };

        dispatch({
            type: 'RESET_SIGN_IN_ERROR'
        });

        try {
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

            dispatch({
                type: 'SIGN_IN',
                payload: userDetails
            });
        } catch (error) {
            console.warn(error);
            dispatch({
                type: 'SIGN_IN_ERROR',
                payload: error
            });
        }
    };

const createAccount = accountInfo =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch({
            type: 'RESET_CREATE_ACCOUNT_ERROR'
        });

        try {
            const response = await request(
                '/rest/V1/customers', {
                    method: 'POST',
                    body: JSON.stringify(accountInfo)
                }
            );
            await dispatch(signIn({ username: accountInfo.customer.email, password: accountInfo.password }));
            dispatch(assignGuestCartToCustomer())

            console.log(response);

        } catch(error) {
            dispatch({
                type: 'ACCOUNT_CREATE_ERROR',
                payload: error,
                error: true
            });
        }
    };

const assignGuestCartToCustomer = () =>
    async function thunk(...args) {
        const [ dispatch, getState ] = args;
        const { user } = getState();

        try {
            const storage = new BrowserPersistence();
            let guestCartId = storage.getItem('guestCartId');
            const payload = {
                customerId: user.id,
                storeId: user.store_id
            }
            // TODO: Check if guestCartId exists
            const transferCartResponse = await request(
                `/rest/V1/guest-carts/${guestCartId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                }
            );
            dispatch(removeGuestCart());
        } catch(error) {
            console.log(error);
        }

    }

function setToken(token) {
    localStorage.setItem('signin_token', token);
}

export { signIn, createAccount, assignGuestCartToCustomer };
