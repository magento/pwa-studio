let messagePort = null;

const handlers = {};

export const registerMessageHandler = (type, handler) => {
    handlers[type] = handler;
};

export const registerMessagePort = port => {
    messagePort = port;
};

export const sendMessageToClient = (type, payload) => {
    if (messagePort) {
        messagePort.postMessage({ type, payload });
    }
};

export const handleMessageFromClient = (type, payload) => {
    const handler = handlers[type];
    if (handler) {
        handler(payload);
    }
};
