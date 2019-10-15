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

export const sendMessageToClient = (type, payload) => client => {
    return new Promise((resolve, reject) => {
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
};

export const sendMessageToClients = (type, payload) => {
    const sendMessage = sendMessageToClient(type, payload);
    return clients.matchAll().then(clients => {
        const [windowClient] = clients.filter(
            client => client.type === 'window'
        );
        return sendMessage(windowClient);
    });
};
