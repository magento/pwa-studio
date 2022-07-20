import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTickets = async (numPage = 1, search = '') => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const reply = await request(
        `/api/v1/tickets/search?expand=true&page=${numPage}&per_page=8&limit=10&order_by=desc&sort_by=created_at${search !== '' ? `&search=${search}` : ''}`,
        {
            method: 'GET',
            headers: JSON.stringify(headers)
        }
    );

    return reply;
};

export default getTickets;
