import handler from '../searchRequestSent';
import { searchRequestEvent, searchbarRequestEvent } from './__mocks__/searchRequestSent';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(searchRequestEvent)).toBeTruthy();
    });

    it('returns true for the correct event type', () => {
        expect(handler.canHandle(searchbarRequestEvent)).toBeTruthy();
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
                setSearchInput: jest.fn()
            },
            publish: {
                searchRequestSent: jest.fn()
            }
        };

        handler.handle(mockSdk, searchRequestEvent);

        expect(mockSdk.context.setSearchInput).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setSearchInput.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "emailAddress": "Stephen.Strange@fake.email",
              "firstName": "Stephen",
              "lastName": "Strange",
            }
        `);

        expect(mockSdk.publish.searchRequestSent).toHaveBeenCalledTimes(1);
    });

    it('calls the correct sdk functions with the correct context value', () => {
        const mockSdk = {
            context: {
                setSearchInput: jest.fn()
            },
            publish: {
                searchRequestSent: jest.fn()
            }
        };

        handler.handle(mockSdk, searchbarRequestEvent);

        expect(mockSdk.context.setSearchInput).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setSearchInput.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "emailAddress": "Stephen.Strange@fake.email",
              "firstName": "Stephen",
              "lastName": "Strange",
            }
        `);

        expect(mockSdk.publish.searchRequestSent).toHaveBeenCalledTimes(1);
    });
});
