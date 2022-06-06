import handler from '../shoppingCartPageView';

import miniCartViewEvent from './__mocks__/miniCartView';
import cartPageViewEvent from './__mocks__/cartPageView';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(cartPageViewEvent)).toBeTruthy();
    });

    it('returns false for non supported event types', () => {
        expect(handler.canHandle(miniCartViewEvent)).toBeFalsy();
    });
});

describe('handle()', () => {
    it('calls the correct sdk functions with the correct context value', () => {
        const mockSdk = {
            context: {
                setShoppingCart: jest.fn(),
                setPage: jest.fn()
            },
            publish: {
                shoppingCartView: jest.fn(),
                pageView: jest.fn()
            }
        };

        handler.handle(mockSdk, cartPageViewEvent);

        expect(mockSdk.context.setShoppingCart).toHaveBeenCalledTimes(1);
        expect(
            mockSdk.context.setShoppingCart.mock.calls[0][0]
        ).toMatchSnapshot();

        expect(mockSdk.publish.shoppingCartView).toHaveBeenCalledTimes(1);

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(
            mockSdk.context.setPage.mock.calls[0][0]
        ).toMatchSnapshot();

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
    });
});
