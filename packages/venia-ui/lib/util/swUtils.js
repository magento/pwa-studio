const handlers = {};

export const registerMessageHandler = (type, handler) => {
    if (!handlers[type]) {
        handlers[type] = [];
    }
    handlers[type].push(handler);
    return () => unRegisterMessageHandler(type, handler);
};

export const unRegisterMessageHandler = (type, handler) => {
    if (handlers[type]) {
        handlers[type] = handlers[type].filter(
            handlerfn => handler !== handlerfn
        );
    }
};

export const handleMessageFromSW = (type, payload, event) => {
    const handlerList = handlers[type];
    if (handlerList) {
        handlerList.forEach(handler => {
            handler(payload, event);
        });
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
