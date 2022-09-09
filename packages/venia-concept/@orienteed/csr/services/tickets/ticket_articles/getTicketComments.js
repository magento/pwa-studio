import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTicketComments = async ticketID => {
    const { request } = Magento2;

    const reply = await request(`/csr/api/v1/ticket_articles/by_ticket/${ticketID}`, {
        method: 'GET',
        credentials: 'include'
    });

    return reply;
};

export default getTicketComments;
