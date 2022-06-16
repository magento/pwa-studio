/**
 * handlers is an object that holds all the message
 * handlers for the client messages. Key is the
 * type of the message and value is an array of handlers.
 *
 * When a message arrives from the client, the
 * message's type will be used to get the list of handlers
 * that need to be invoked from the handlers object.
 */
const handlers = {};

/**
 * Exporting for testing purposes
 */
export const __handlers__ = handlers;

/**
 *
 * registerMessageHandler is a Util that registers a
 * handler for a given message type in the handlers object.
 *
 * handler is a function that bears this signature:
 *
 * (payload: Object, event: MessageEvent) => void
 *
 * @param {string} type type of the message to register a handler
 * @param {function} handler reference of the function to register as handler
 *
 * @returns {function} a function that when called will unregister
 * the handler from the handlers object.
 */
export const registerMessageHandler = (type, handler) => {
    if (!handlers[type]) {
        handlers[type] = [];
    }
    handlers[type].push(handler);
    return () => unRegisterMessageHandler(type, handler);
};

/**
 * unRegisterMessageHandler is a util that will un register
 * a handler for a given message type in the handlers object.
 *
 * The handler function provided here should be the exact function
 * that was used to register in the first place.
 *
 * @param {string} type type of the message handler to unregister
 * @param {function} handler reference of the handler to unregister
 *
 * @returns {void}
 */
export const unRegisterMessageHandler = (type, handler) => {
    if (handlers[type]) {
        handlers[type] = handlers[type].filter(handlerfn => handler !== handlerfn);
    }
};

/**
 *
 * handleMessageFromClient handles messages from the client. It matches
 * the message with the handler in the handlers object and delegates
 * the message payload along with the MessageEvent to the handler.
 *
 * @param {string} type type of the message from the client
 * @param {object} payload payload of the message from the client
 * @param {MessageEvent} event MessageEvent of the message from the client
 *
 * @returns {void}
 */
export const handleMessageFromClient = (type, payload, event) => {
    const handlerList = handlers[type];
    if (handlerList) {
        handlerList.forEach(handler => {
            handler(payload, event);
        });
    }
};

/**
 *
 * sendMessageToClient sends a message to the given client. It constructs the
 * message with the type and payload provided as arguments and wraps them in a
 * promise that will be returned to the caller. If the client responds to the
 * message, the promise will resolve with that response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel
 *
 * @param {Client} client client to send the message
 * @param {string} type type of the message to be sent to the client
 * @param {object} payload payload of the message to be sent to the client
 *
 * @returns {Promise} promise that will resolve to the reply from the client
 */
export const sendMessageToClient = (client, type, payload) =>
    new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        /**
         * channel.port1 is the port for the channel creator to use
         * to send a message to the receiver.
         *
         * channel.port2 is the port for the message receiver to use
         * to communicate to the channel creator.
         */

        // Listening for a reply from the client
        channel.port1.onmessage = event => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
            channel.port1.close();
        };

        if (client && client.postMessage) {
            client.postMessage({ type, payload }, [channel.port2]);
        } else {
            reject(`Unable to send message to ${client ? client.type : 'client'}`);
            channel.port1.close();
        }
    });

/**
 *
 * sendMessageToWindow sends a message to the window. It constructs the
 * message with the type and payload provided as arguments and wraps them in a
 * promise that will be returned to the caller. If the window responds to the
 * message, the promise will resolve with that response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel
 *
 * @param {string} type type of the message to be sent to the window
 * @param {object} payload payload of the message to be sent to the window
 *
 * @returns {Promise} promise that will resolve to the reply from the window
 */

export const sendMessageToWindow = (type, payload) =>
    clients.matchAll().then(clients => {
        const [windowClient] = clients.filter(client => client.type === 'window');
        return sendMessageToClient(windowClient, type, payload);
    });
