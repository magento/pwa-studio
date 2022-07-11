import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTickets = async () => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const reply = await request('/api/v1/tickets/search?expand=true&page=1&per_page=8&limit=10', {
        method: 'GET',
        headers: JSON.stringify(headers)
    });

    return reply;
};

export default getTickets;
