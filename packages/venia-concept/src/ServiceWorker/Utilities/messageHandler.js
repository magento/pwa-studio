const handlers = {};

export const registerMessageHandler = (type, handler) => {
    handlers[type] = handler;
};

export const handleMessageFromClient = (type, payload, event) => {
    const handler = handlers[type];
    if (handler) {
        handler(payload, event);
    }
};

export const sendMessageToClient = (client, type, payload) =>
    new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = event => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        client.postMessage({ type, payload }, [channel.port2]);
    });

export const sendMessageToWindow = (type, payload) =>
    clients.matchAll().then(clients => {
        const [windowClient] = clients.filter(
            client => client.type === 'window'
        );
        return sendMessageToClient(windowClient, type, payload);
    });
