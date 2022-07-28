import { Magento2 } from '@magento/peregrine/lib/RestApi';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const doCsrLogin = async () => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const data = {};

    const reply = await request('/csr/api/v1/login', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(data)
    });

    return reply;
};

export default doCsrLogin;
