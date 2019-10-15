const handlers = {};

export const registerMessageHandler = (type, handler) => {
    handlers[type] = handler;
};

export const handleMessageFromSW = (type, payload, event) => {
    const handler = handlers[type];
    if (handler) {
        handler(payload, event);
    }
};

export const sendMessageToSW = (type, payload) => {
    return new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = event => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        navigator.serviceWorker.controller.postMessage({ type, payload }, [
            channel.port2
        ]);
    });
};
