import { __handlers__, registerMessageHandler } from '../messageHandler';

describe('Testing registerMessageHandler', () => {
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
