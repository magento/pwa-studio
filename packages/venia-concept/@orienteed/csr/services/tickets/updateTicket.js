import { Magento2 } from '@magento/peregrine/lib/RestApi';

const updateTicket = async (ticketId, state) => {
    const { request } = Magento2;

    const ticketBody = {
        state: state
    };

    const reply = await request(`/csr/api/v1/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(ticketBody),
        credentials: 'include'
    });

    return reply;
};

export default updateTicket;
