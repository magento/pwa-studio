import { Magento2 } from '@magento/peregrine/lib/RestApi';

const getTicketAttachment = async (ticketId, articleId, attachmentId) => {
    const { request } = Magento2;

    const reply = await request(`/csr/api/v1/ticket_attachment/${ticketId}/${articleId}/${attachmentId}`, {
        method: 'GET',
        parseJSON: false,
        credentials: 'include'
    });

    return reply.blob();
};

export default getTicketAttachment;
