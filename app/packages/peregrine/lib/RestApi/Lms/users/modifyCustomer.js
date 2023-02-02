import { Magento2 } from '@magento/peregrine/lib/RestApi';

const modifyLmsCustomer = async (firstname, lastname, username, password) => {
    const { request } = Magento2;

    const customerBody = {
        firstname,
        lastname,
        username,
        password
    };

    const wait = ms => new Promise(res => setTimeout(res, ms));
    const callWithRetry = async (depth = 0) => {
        const tempReply = await request('/lms/api/v1/users/', {
            method: 'PUT',
            body: JSON.stringify(customerBody),
            credentials: 'include'
        });
        if (tempReply.hasOwnProperty('message') && tempReply['message'] === 'User modification successfully') {
            return tempReply;
        } else {
            if (depth > 7) return;
            await wait(2 ** depth * 10);
            return callWithRetry(depth + 1);
        }
    };

    const reply = callWithRetry();

    return reply;
};

export default modifyLmsCustomer;
