import { Magento2 } from '@magento/peregrine/lib/RestApi';

const createTicket = async (ticketType, title, description, files, order, attachedFilesText) => {
    const { request } = Magento2;

    const ticketBodyText =
        ticketType === 'Order issue'
            ? `${description}\n\nOrder details:\n- Order number: ${order?.number}\n- Date: ${
                  order.order_date
              }\n- Status: ${order?.status}\n- Price: ${order?.total}\n\n${attachedFilesText}`
            : description;

    const ticketBody = {
        title: title,
        group: ticketType,
        article: {
            subject: title,
            body: ticketBodyText,
            attachments: files.map(file => {
                return { filename: file.name, data: file.content || '', mime_type: file.mimeType };
            })
        }
    };

    const reply = await request('/csr/api/v1/tickets/', {
        method: 'POST',
        body: JSON.stringify(ticketBody),
        credentials: 'include'
    });

    if (reply) {
        return reply;
    } else {
        return false;
    }
};

export default createTicket;
