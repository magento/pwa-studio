import handler from '../startCheckout';
import startCheckoutEvent from './__mocks__/checkoutPageView';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(startCheckoutEvent)).toBeTruthy();
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
                setShoppingCart: jest.fn()
            },
            publish: {
                pageView: jest.fn(),
                initiateCheckout: jest.fn()
            }
        };

        handler.handle(mockSdk, startCheckoutEvent);

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setPage.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "eventType": "visibilityHidden",
              "maxXOffset": 0,
              "maxYOffset": 0,
              "minXOffset": 0,
              "minYOffset": 0,
              "pageName": "Checkout",
              "pageType": "Checkout",
            }
        `);

        expect(mockSdk.context.setShoppingCart).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setShoppingCart.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "giftMessageSelected": false,
              "giftWrappingSelected": false,
              "id": "adaIGWl4UsoKOGIeX17FPrnMq3bXHVZA",
              "items": Array [
                Object {
                  "configurableOptions": Array [
                    Object {
                      "id": undefined,
                      "optionLabel": "Fashion Color",
                      "valueId": "Y29uZmlndXJhYmxlLzE1Ny8zNQ==",
                      "valueLabel": "Mint",
                    },
                    Object {
                      "id": undefined,
                      "optionLabel": "Fashion Size",
                      "valueId": "Y29uZmlndXJhYmxlLzE5MC80OQ==",
                      "valueLabel": "6",
                    },
                  ],
                  "formattedPrice": "",
                  "id": "Mjk3Nw==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 98,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 294,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": undefined,
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/p/vp08-rn_main_2.jpg",
                    "name": "Bella Eyelet Capris",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 98,
                      "minimalPrice": 98,
                      "regularPrice": 98,
                    },
                    "productType": "ConfigurableProduct",
                    "sku": "VP08",
                  },
                  "quantity": 3,
                },
                Object {
                  "configurableOptions": Array [
                    Object {
                      "id": undefined,
                      "optionLabel": "Fashion Size",
                      "valueId": "Y29uZmlndXJhYmxlLzE5MC80NA==",
                      "valueLabel": "M",
                    },
                  ],
                  "formattedPrice": "",
                  "id": "Mjk3OQ==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 38,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 38,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": undefined,
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va09-br_main_2.jpg",
                    "name": "Thin Leather Braided Belt",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 38,
                      "minimalPrice": 38,
                      "regularPrice": 38,
                    },
                    "productType": "ConfigurableProduct",
                    "sku": "VA09",
                  },
                  "quantity": 1,
                },
                Object {
                  "configurableOptions": null,
                  "formattedPrice": "",
                  "id": "Mjk4Nw==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 98,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 98,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": undefined,
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va22-si_main.jpg",
                    "name": "Silver Amor Bangle Set",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 98,
                      "minimalPrice": 98,
                      "regularPrice": 98,
                    },
                    "productType": "SimpleProduct",
                    "sku": "VA22-SI-NA",
                  },
                  "quantity": 1,
                },
              ],
              "possibleOnepageCheckout": false,
              "prices": Object {
                "subtotalExcludingTax": Object {
                  "currency": "USD",
                  "value": 430,
                },
              },
            }
        `);

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
        expect(mockSdk.publish.initiateCheckout).toHaveBeenCalledTimes(1);
    });
});
