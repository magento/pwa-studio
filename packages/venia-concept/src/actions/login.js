import { RestApi } from '@magento/peregrine';

const { request } = RestApi.Magento2;

const logInUser = credentials =>
    async function thunk(...args) {
        const [dispatch] = args;

        const body = {
            username: 'roni_cost@example.com',
            password: 'roni_cost3@example.com'
            // credentials.username
            // credentials.password
        }

        dispatch({
            type: 'RESET_LOG_IN_ERROR'
        });

        try {
            const response = await request('/rest/V1/integration/customer/token', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            setToken(response);

            const userDetails = await request('/rest/V1/customers/me', {
                method: 'GET'
            });

            dispatch({
                type: 'LOG_IN',
                payload: userDetails
            });

        } catch (error) {
            console.warn(error)
            dispatch({
                type: 'LOG_IN_ERROR',
                payload: error
            });
        }

    };

function setToken(token) {
    localStorage.setItem('login_token', token);
}



export { logInUser };
