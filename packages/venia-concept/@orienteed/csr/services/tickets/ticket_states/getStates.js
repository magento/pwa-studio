import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getStates = async () => {
    const { request } = Magento2;

    const reply = await request('/csr/api/v1/ticket_states/', {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getStates;
