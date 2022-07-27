import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const sendComment = async (ticket_id, comment, files, attachedFilesText) => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const ticketBody = {
        ticket_id: ticket_id,
        body: `${comment}${files.length !== 0 ? '\n\n' + attachedFilesText : ''}`,
        content_type: 'text/plain',
        type: 'note', // TODO_B2B: Remove it
        internal: false, // TODO_B2B: Remove it
        sender: 'Customer', // TODO_B2B: Remove it
        attachments: files.map(file => {
            return { filename: file.name, data: file.content, mime_type: file.mimeType };
        })
    };

    const reply = await request('/api/v1/ticket_articles/', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(ticketBody)
    });

    return reply;
};

export default sendComment;
