import { Magento2 } from '@magento/peregrine/lib/RestApi';

const sendComment = async (ticket_id, comment, files, isTicketClosed) => {
    const { request } = Magento2;

    const ticketBody = {
        ticket_id: ticket_id,
        ticket_closed: isTicketClosed,
        body: comment,
        content_type: 'text/plain',
        attachments: files.map(file => {
            return { filename: file.name, data: file.content || '', mime_type: file.mimeType };
        })
    };

    const reply = await request('/csr/api/v1/ticket_articles/', {
        method: 'POST',
        body: JSON.stringify(ticketBody),
        credentials: 'include'
    });

    return reply;
};

export default sendComment;
