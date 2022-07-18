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

    const reply = await request('/api/v1/login', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(data)
    });
    
    // TODO_B2B: Remove it 
    console.log(reply.message);

    return reply;
};

export default doCsrLogin;
