import handler from '../productPageView';
import productPageViewEvent from './__mocks__/productPageView';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(productPageViewEvent)).toBeTruthy();
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
                setPage: jest.fn(),
                setProduct: jest.fn()
            },
            publish: {
                pageView: jest.fn(),
                productPageView: jest.fn()
            }
        };

        handler.handle(mockSdk, productPageViewEvent);

        expect(mockSdk.context.setProduct).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setProduct.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "canonicalUrl": "selena-pants",
              "name": "Selena Pants",
              "pricing": Object {
                "currencyCode": "USD",
                "maximalPrice": 40,
              },
              "productId": "234d",
              "sku": "343g3434t",
            }
        `);

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setPage.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "eventType": "visibilityHidden",
              "maxXOffset": 0,
              "maxYOffset": 0,
              "minXOffset": 0,
              "minYOffset": 0,
              "pageName": "Selena Pants",
              "pageType": "PDP",
            }
        `);

        expect(mockSdk.publish.productPageView).toHaveBeenCalledTimes(1);
        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
    });
});
