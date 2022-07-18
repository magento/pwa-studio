import handler from '../completeCheckout';
import completeCheckoutEvent from './__mocks__/completeCheckout';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(completeCheckoutEvent)).toBeTruthy();
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
                setOrder: jest.fn(),
                setPage: jest.fn()
            },
            publish: {
                placeOrder: jest.fn(),
                pageView: jest.fn()
            }
        };

        handler.handle(mockSdk, completeCheckoutEvent);

        expect(mockSdk.context.setOrder).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setOrder.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "grandTotal": 40,
              "orderId": "001",
              "orderType": "checkout",
              "payments": Array [
                Object {
                  "paymentMethodCode": "Visa",
                  "paymentMethodName": "Visa",
                  "total": 40,
                },
              ],
              "shipping": Object {
                "shippingAmount": 13,
                "shippingMethod": "method",
              },
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
              "pageName": "Order Confirmation",
              "pageType": "Order Confirmation Page",
            }
        `);

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
        expect(mockSdk.publish.placeOrder).toHaveBeenCalledTimes(1);
    });
});
