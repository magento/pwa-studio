import { RestApi } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';

const { request } = RestApi.Magento2;

const logInUser = credentials =>
    async function thunk(...args) {
        const [dispatch, getState] = args;

        const body = {
            username: 'roni_cost@example.com',
            password: 'roni_cost3@example.com'
            // credentials.username
            // credentials.password
        }

        try {
            const response = await request('/rest/V1/integration/customer/token', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            dispatch({
                type: 'LOG_IN',
                payload: response
            });

        } catch (error) {
            console.warn(error)
            // dispatch({
            //     type: 'CREATE_GUEST_CART',
            //     payload: error,
            //     error: true
            // });
        }

    };



export { logInUser };
