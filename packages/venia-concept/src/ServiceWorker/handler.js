const handlers = {};

export const registerHandler = (type, handler) => {
    handlers[type] = handler;
};

export const handleMessageEvent = (type, payload) => {
    const handler = handlers[type];
    if (handler) {
        handler(payload);
    }
};
