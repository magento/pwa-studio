import handler from '../pageView';
import cmsPageViewEvent from './__mocks__/pageView';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(cmsPageViewEvent)).toBeTruthy();
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
                setPage: jest.fn()
            },
            publish: {
                pageView: jest.fn()
            }
        };

        handler.handle(mockSdk, cmsPageViewEvent);

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setPage.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "eventType": "visibilityHidden",
              "maxXOffset": 0,
              "maxYOffset": 0,
              "minXOffset": 0,
              "minYOffset": 0,
              "pageName": "Home Page - Venia",
              "pageType": "CMS",
            }
        `);

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
    });
});
