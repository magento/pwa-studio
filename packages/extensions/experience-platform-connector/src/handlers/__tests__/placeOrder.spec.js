import handler from '../placeOrder';
import placeOrderEvent from './__mocks__/placeOrderButtonClicked';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(placeOrderEvent)).toBeTruthy();
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
                setOrder: jest.fn()
            },
            publish: {
                placeOrder: jest.fn()
            }
        };

        handler.handle(mockSdk, placeOrderEvent);

        expect(mockSdk.context.setOrder).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setOrder.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "grandTotal": 466.01,
              "orderType": "checkout",
              "payments": Array [
                Object {
                  "paymentMethodCode": "Credit Card",
                  "paymentMethodName": "Credit Card",
                  "total": 466.01,
                },
              ],
              "shipping": Object {
                "shippingAmount": 0,
                "shippingMethod": "Free",
              },
            }
        `);

        expect(mockSdk.publish.placeOrder).toHaveBeenCalledTimes(1);
    });
});
