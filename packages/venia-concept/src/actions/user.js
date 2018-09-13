import { RestApi } from '@magento/peregrine';
import BrowserPersistence from 'src/util/simplePersistence.js';

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
        debugger;

        try {
            const browserPersistance = new BrowserPersistence();
            const response = await request(
                '/rest/V1/customers', {
                    method: 'POST',
                    body: JSON.stringify(accountInfo)
                }
            );

            const body = {
                username: accountInfo.customer.email,
                password: accountInfo.password
            };

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

        try {
            let guestCartId = browserPersistance.getItem('guestCartId');
            const payload = {
                customer : getState().user.id,
                storeId: getState().user.store_id
            }
            const transferCartResponse = await request(
                `/V1/guest-carts/${guestCartId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                }
            );
        } catch(error) {
            console.log(error);
        }

    }
function setToken(token) {
    localStorage.setItem('signin_token', token);
}

export { signIn, createAccount, assignGuestCartToCustomer };
