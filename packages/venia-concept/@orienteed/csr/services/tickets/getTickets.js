import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTickets = async (
    orderBy = 'desc',
    numPage = 1,
    search = '',
    sortBy = 'created_at',
    filters = { status: [], type: [] }
) => {
    const { request } = Magento2;

    const reply = await request(
        `/csr/api/v1/tickets/search?expand=true&page=${numPage}&per_page=8&limit=10&order_by=${orderBy}&sort_by=${sortBy}${
            search !== '' ? `&search=${search}` : ''
        }&filters=${JSON.stringify(filters)}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    return reply;
};

export default getTickets;
