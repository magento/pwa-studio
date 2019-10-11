let wb = null;

const handlers = {};

export const registerWorkboxInstance = wbInstance => {
    wb = wbInstance;
};

export const registerMessageHandler = (type, handler) => {
    handlers[type] = handler;
};

export const handleMessageFromSW = (type, payload) => {
    const handler = handlers[type];
    if (handler) {
        handler(payload);
    }
};

export const sendMessageToSW = (type, payload) => {
    if (wb) {
        wb.messageSW({
            type,
            payload
        });
    }
};
