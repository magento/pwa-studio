import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getGroups = async () => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const reply = await request('/csr/api/v1/groups', {
        method: 'GET',
        headers: JSON.stringify(headers)
    });

    return reply;
};

export default getGroups;
