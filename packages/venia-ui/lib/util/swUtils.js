import { UPDATE_CLIENT_TO_SW_MESSAGE_PORT } from '../constants/messageTypes';

let messagePort = null;

let messageChannel = null;

const handlers = {};

export const createMessageChannel = () => {
    messageChannel = new MessageChannel();
    messagePort = messageChannel.port1;
};

export const sendMessagePortToSW = () => {
    if (messageChannel) {
        navigator.serviceWorker.controller.postMessage(
            { type: UPDATE_CLIENT_TO_SW_MESSAGE_PORT },
            [messageChannel.port2]
        );
    }
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
    if (messagePort) {
        messagePort.postMessage({ type, payload });
    }
};
