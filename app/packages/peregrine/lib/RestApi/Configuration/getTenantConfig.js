import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTenantConfig = async() => {
    const { request } = Magento2;

    const reply = await request('/env', {
        method: 'GET'
    });

    return reply;
};

export default getTenantConfig;