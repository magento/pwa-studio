import handler from '../createAccount';
import createAccountEvent from './__mocks__/createAccount';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(createAccountEvent)).toBeTruthy();
    });

    it('returns false for non supported event types', () => {
        const mockEvent = {
            type: 'USER_SIGN_OUT',
            payload: {}
        };
        expect(handler.canHandle(mockEvent)).toBeFalsy();
    });
});

describe('handle()', () => {
    it('calls the correct sdk functions with the correct context value', () => {
        const mockSdk = {
            context: {
                setAccount: jest.fn()
            },
            publish: {
                createAccount: jest.fn()
            }
        };

        handler.handle(mockSdk, createAccountEvent);

        expect(mockSdk.context.setAccount).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setAccount.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "emailAddress": "Stephen.Strange@fake.email",
              "firstName": "Stephen",
              "lastName": "Strange",
            }
        `);

        expect(mockSdk.publish.createAccount).toHaveBeenCalledTimes(1);
    });
});
