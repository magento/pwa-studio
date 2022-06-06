import handler from '../categoryPageView';

import categoryPageViewEvent from './__mocks__/categoryPageView';
import miniCartViewEvent from './__mocks__/miniCartView';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(categoryPageViewEvent)).toBeTruthy();
    });

    it('returns false for non supported event types', () => {
        expect(handler.canHandle(miniCartViewEvent)).toBeFalsy();
    });
});

describe('handle()', () => {
    it('calls the correct sdk functions with the correct context value', () => {
        const mockSdk = {
            context: {
                setCategory: jest.fn(),
                setPage: jest.fn()
            },
            publish: {
                pageView: jest.fn()
            }
        };

        handler.handle(mockSdk, categoryPageViewEvent);

        expect(mockSdk.context.setCategory).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setCategory.mock.calls[0][0]).toMatchSnapshot();

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setPage.mock.calls[0][0]).toMatchSnapshot();

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
    });
});
