import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { Magento2 } from '@magento/peregrine/lib/RestApi';

const createTicket = async (ticketType, title, description, files, order, attachedFilesText) => {
    const storage = new BrowserPersistence();
    const bearerToken = storage.getItem('signin_token');
    const { request } = Magento2;

    const headers = {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
    };

    const ticketBody = {
        title: title,
        group: ticketType,
        customer: 'amino@orienteed.com',
        article: {
            subject: title,
            body: description,
            type: 'note',
            internal: false
        }
    };

    const orderBody = id => {
        return {
            ticket_id: id,
            body: `Order details:\n- Order number: ${order.number}\n- Date: ${order.order_date}\n- Status: ${
                order.status
            }\n- Price: ${order.total}`,
            content_type: 'text/plain',
            type: 'note',
            internal: false,
            attachments: []
        };
    };

    const attachmentsBody = id => {
        return {
            ticket_id: id,
            body: attachedFilesText,
            content_type: 'text/plain',
            type: 'note',
            internal: false,
            attachments: files.map(file => {
                return { filename: file.name, data: file.content, 'mime-type': file.mimeType };
            })
        };
    };

    console.log({ ticketType, title, description, files, order });

    const reply = await request('/api/v1/tickets', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(ticketBody)
    });

    if (ticketType === 'Order issue') {
        await request('/api/v1/ticket_articles', {
            method: 'POST',
            headers: JSON.stringify(headers),
            body: JSON.stringify(orderBody(reply.id))
        });
    }

    if (files.length !== 0) {
        await request('/api/v1/ticket_articles', {
            method: 'POST',
            headers: JSON.stringify(headers),
            body: JSON.stringify(attachmentsBody(reply.id))
        });
    }

    return reply;
};

export default createTicket;
