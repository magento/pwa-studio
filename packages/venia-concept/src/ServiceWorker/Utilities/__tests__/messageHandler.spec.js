import {
    __handlers__,
    registerMessageHandler,
    unRegisterMessageHandler,
    handleMessageFromClient,
    sendMessageToClient,
    sendMessageToWindow
} from '../messageHandler';

const messageType = 'HELLO_WORLD';

const handler = () => {};

function clearHandlersObject() {
    Object.keys(__handlers__).forEach(messageType => {
        delete __handlers__[messageType];
    });
}

afterEach(() => {
    clearHandlersObject();
});

describe('Testing registerMessageHandler', () => {
    test('registerMessageHandler should return function', () => {
        expect(registerMessageHandler(messageType, handler)).toBeInstanceOf(
            Function
        );
    });

    test('registerMessageHandler should add a message handler for a given type in the handlers object', () => {
        registerMessageHandler(messageType, handler);

        expect(__handlers__).toHaveProperty(messageType);
        expect(__handlers__[messageType]).toBeInstanceOf(Array);
        expect(__handlers__[messageType]).toHaveLength(1);
        expect(__handlers__[messageType]).toContain(handler);
    });

    test('registerMessageHandler should return function which when called should un-register handler', () => {
        const unregisterHelloWorld = registerMessageHandler(
            messageType,
            handler
        );

        unregisterHelloWorld();

        expect(__handlers__[messageType]).not.toContain(handler);
    });

    test("registerMessageHandler's return function should only unregister the function it registered", () => {
        const unregisterHelloWorld = registerMessageHandler(
            messageType,
            handler
        );

        const anotherHandler = () => {};

        registerMessageHandler(messageType, anotherHandler);

        expect(__handlers__[messageType]).toContain(handler);
        expect(__handlers__[messageType]).toContain(anotherHandler);

        unregisterHelloWorld();

        expect(__handlers__[messageType]).not.toContain(handler);
        expect(__handlers__[messageType]).toContain(anotherHandler);
    });
});

describe('Testing unRegisterMessageHandler', () => {
    test('unRegisterMessageHandler should remove a handler for a given type', () => {
        const anotherHandler = () => {};
        __handlers__[messageType] = [handler, anotherHandler];

        unRegisterMessageHandler(messageType, handler);

        expect(__handlers__[messageType]).not.toContain(handler);
        expect(__handlers__[messageType]).toContain(anotherHandler);
    });

    test('unRegisterMessageHandler should not modify the handlers object if the given handler is not part of it', () => {
        const anotherHandler = () => {};
        __handlers__[messageType] = [handler];

        const handlersBefore = __handlers__[messageType];

        unRegisterMessageHandler(messageType, anotherHandler);

        expect(__handlers__[messageType]).toEqual(handlersBefore);
    });

    test('unRegisterMessageHandler should not modify __handlers__ if the given messageType is not registered', () => {
        const anotherHandler = () => {};
        __handlers__[messageType] = [handler];

        const handlersBefore = { ...__handlers__ };

        unRegisterMessageHandler('TEST', anotherHandler);

        expect(__handlers__).toEqual(handlersBefore);
    });
});

describe('Testing handleMessageFromClient', () => {
    test('handleMessageFromClient should call all registered handlers for a given messageType', () => {
        const payload = {};
        const event = {};
        const handler1 = jest.fn();
        const handler2 = jest.fn();

        registerMessageHandler(messageType, handler1);
        registerMessageHandler(messageType, handler2);

        handleMessageFromClient(messageType, payload, event);

        expect(handler1).toHaveBeenCalledWith(payload, event);
        expect(handler2).toHaveBeenCalledWith(payload, event);
    });

    test('handleMessageFromClient should call all registered handlers in the same order of registration (First in First called)', () => {
        const payload = {};
        const event = {};
        const log = [];
        const handler1 = () => {
            log.push('handler1 called');
        };
        const handler2 = () => {
            log.push('handler2 called');
        };

        registerMessageHandler(messageType, handler1);
        registerMessageHandler(messageType, handler2);

        handleMessageFromClient(messageType, payload, event);

        expect(log).toEqual(['handler1 called', 'handler2 called']);
    });
});

describe('Testing sendMessageToClient', () => {
    function Port() {
        this.onmessage = null;
        this.close = () => {};
    }

    beforeEach(() => {
        global.MessageChannel = function MessageChannel() {
            this.port1 = new Port();
            this.port2 = new Port();

            this.port1.postMessage = event => {
                this.port2.onmessage && this.port2.onmessage(event);
            };

            this.port2.postMessage = event => {
                this.port1.onmessage && this.port1.onmessage(event);
            };
        };
    });

    test('sendMessageToClient should return a Promise', () => {
        expect(
            sendMessageToClient({ postMessage: () => {} }, messageType, {})
        ).toBeInstanceOf(Promise);
    });

    test('sendMessageToClient should reject if the client does not have postMessage function defined', async () => {
        await expect(
            sendMessageToClient({ type: 'worker' }, messageType, {})
        ).rejects.toBe('Unable to send message to worker');
    });

    test('sendMessageToClient should reject if the client is not defined', async () => {
        await expect(sendMessageToClient(null, messageType, {})).rejects.toBe(
            'Unable to send message to client'
        );
    });

    test('sendMessageToClient should call the postMessage function on client with type, payload and a port to reply back', () => {
        const port2 = new Port();
        global.MessageChannel = function MessageChannel() {
            this.port1 = new Port();
            this.port2 = port2;
        };
        const postMessage = jest.fn();
        const client = { postMessage };
        const payload = {};

        sendMessageToClient(client, messageType, payload);

        expect(postMessage).toHaveBeenCalledWith(
            { type: messageType, payload },
            [port2]
        );
    });

    test('sendMessageToClient should register onmessage handler on port1 of the channel to listen for replies from client', async () => {
        const replyMessage = 'MESSAGE_RECEIVED';
        const postMessage = jest.fn();
        const client = { postMessage };

        const reply = sendMessageToClient(client, messageType, {});

        const [portToReplyToClient] = postMessage.mock.calls[0][1];

        portToReplyToClient.postMessage({ data: replyMessage });

        await expect(reply).resolves.toBe(replyMessage);
    });

    test('sendMessageToClient should resolve promise with data sent back by the client in the reply', async () => {
        const replyData = {
            messageType: 'MESSAGE_RECEIVED',
            payload: {}
        };
        const postMessage = jest.fn();
        const client = { postMessage };

        const reply = sendMessageToClient(client, messageType, {});

        const [portToReplyToClient] = postMessage.mock.calls[0][1];

        portToReplyToClient.postMessage({ data: replyData });

        await expect(reply).resolves.toBe(replyData);
    });

    test('sendMessageToClient should reject promise with error sent back from the client', async () => {
        const replyData = {
            error: 'Unable to read message!!!'
        };
        const postMessage = jest.fn();
        const client = { postMessage };

        const reply = sendMessageToClient(client, messageType, {});

        const [portToReplyToClient] = postMessage.mock.calls[0][1];

        portToReplyToClient.postMessage({ data: replyData });

        await expect(reply).rejects.toBe(replyData.error);
    });
});

describe('Testing sendMessageToWindow', () => {
    const windowPostMessage = jest.fn();
    const workerPostMessage = jest.fn();

    function Port() {
        this.onmessage = null;
    }

    beforeEach(() => {
        global.MessageChannel = function MessageChannel() {
            this.port1 = new Port();
            this.port2 = new Port();

            this.port1.postMessage = event => {
                this.port2.onmessage && this.port2.onmessage(event);
            };

            this.port2.postMessage = event => {
                this.port1.onmessage && this.port1.onmessage(event);
            };
        };
        global.clients = {
            matchAll: () =>
                Promise.resolve([
                    {
                        type: 'window',
                        postMessage: windowPostMessage
                    },
                    {
                        type: 'worker',
                        postMessage: workerPostMessage
                    }
                ])
        };
    });

    afterEach(() => {
        windowPostMessage.mockClear();
        workerPostMessage.mockClear();
    });

    test('sendMessageToWindow should return a Promise', () => {
        expect(sendMessageToWindow(messageType, {})).toBeInstanceOf(Promise);
    });

    test('sendMessageToWindow should reject if the window client does not have postMessage function defined', async () => {
        global.clients = {
            matchAll: () =>
                Promise.resolve([
                    {
                        type: 'window'
                    },
                    {
                        type: 'worker',
                        postMessage: workerPostMessage
                    }
                ])
        };

        await expect(sendMessageToWindow(messageType, {})).rejects.toBe(
            'Unable to send message to window'
        );
    });

    test('sendMessageToWindow should call the postMessage function on window with type, payload and a port to reply back', () => {
        const port2 = new Port();
        global.MessageChannel = function MessageChannel() {
            this.port1 = new Port();
            this.port2 = port2;
        };
        const payload = {};

        sendMessageToWindow(messageType, payload);

        return new Promise(resolve => {
            setTimeout(() => {
                expect(windowPostMessage).toHaveBeenCalledWith(
                    { type: messageType, payload },
                    [port2]
                );
                resolve();
            }, 0);
        });
    });
});
