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

    const ticketBodyText =
        ticketType === 'Order issue'
            ? `${description}\n\nOrder details:\n- Order number: ${order?.number}\n- Date: ${
                  order.order_date
              }\n- Status: ${order?.status}\n- Price: ${order?.total}`
            : description;

    const ticketBody = {
        title: title,
        group: ticketType,
        article: {
            subject: title,
            body: ticketBodyText,
            type: 'chat',
            attachments: files.map(file => {
                return { filename: file.name, data: file.content, mime_type: file.mimeType };
            })
        }
    };

    const reply = await request('/api/v1/tickets/', {
        method: 'POST',
        headers: JSON.stringify(headers),
        body: JSON.stringify(ticketBody)
    });

    console.log({ reply });

    if (reply) {
        return reply;
    } else {
        return false;
    }
};

export default createTicket;
