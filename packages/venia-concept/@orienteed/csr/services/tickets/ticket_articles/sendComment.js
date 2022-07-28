import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const sendComment = async (ticket_id, comment, files) => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const ticketBody = {
        ticket_id: ticket_id,
        body: comment,
        content_type: 'text/plain',
        attachments: files.map(file => {
            return { filename: file.name, data: file.content || '', mime_type: file.mimeType };
        })
    };

    const reply = await request('/csr/api/v1/ticket_articles/', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(ticketBody)
    });

    return reply;
};

export default sendComment;
