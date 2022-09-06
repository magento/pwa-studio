import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getGroups = async () => {
    const { request } = Magento2;

    const reply = await request('/csr/api/v1/groups/', {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getGroups;
