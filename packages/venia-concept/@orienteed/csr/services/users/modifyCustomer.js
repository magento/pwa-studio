import { Magento2 } from '@magento/peregrine/lib/RestApi';

const modifyCustomer = async (firstname, lastname, username) => {
    const { request } = Magento2;

    const customerBody = {
        firstname,
        lastname,
        username
    };

    const reply = await request('/csr/api/v1/users/', {
        method: 'PUT',
        body: JSON.stringify(customerBody),
        credentials: 'include'
    });

    return reply;
};

export default modifyCustomer;
