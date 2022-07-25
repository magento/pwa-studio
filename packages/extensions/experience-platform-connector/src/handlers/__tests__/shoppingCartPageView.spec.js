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
        expect(mockSdk.context.setShoppingCart.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "giftMessageSelected": false,
              "giftWrappingSelected": false,
              "id": "kAR5Gg6uPC6J5wGY0ebecyKfX905epmU",
              "items": Array [
                Object {
                  "configurableOptions": Array [
                    Object {
                      "id": 157,
                      "optionLabel": "Fashion Color",
                      "valueId": "Y29uZmlndXJhYmxlLzE1Ny8zMQ==",
                      "valueLabel": "Peach",
                    },
                    Object {
                      "id": 190,
                      "optionLabel": "Fashion Size",
                      "valueId": "Y29uZmlndXJhYmxlLzE5MC80Mw==",
                      "valueLabel": "L",
                    },
                  ],
                  "formattedPrice": "",
                  "id": "MjQ2Ng==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 78,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 78,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": "rowena-skirt",
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/s/vsk02-ll_main_2.jpg",
                    "name": "Rowena Skirt",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 78,
                      "minimalPrice": 78,
                      "regularPrice": 78,
                    },
                    "productType": "ConfigurableProduct",
                    "sku": "VSK02",
                  },
                  "quantity": 1,
                },
                Object {
                  "configurableOptions": null,
                  "formattedPrice": "",
                  "id": "MjQ4Mg==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 68,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 136,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": "silver-cirque-earrings",
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va17-si_main.jpg",
                    "name": "Silver Cirque Earrings",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 68,
                      "minimalPrice": 68,
                      "regularPrice": 68,
                    },
                    "productType": "SimpleProduct",
                    "sku": "VA17-SI-NA",
                  },
                  "quantity": 2,
                },
                Object {
                  "configurableOptions": Array [
                    Object {
                      "id": 157,
                      "optionLabel": "Fashion Color",
                      "valueId": "Y29uZmlndXJhYmxlLzE1Ny8zMQ==",
                      "valueLabel": "Peach",
                    },
                    Object {
                      "id": 190,
                      "optionLabel": "Fashion Size",
                      "valueId": "Y29uZmlndXJhYmxlLzE5MC80NA==",
                      "valueLabel": "M",
                    },
                  ],
                  "formattedPrice": "",
                  "id": "MjQ4Mw==",
                  "prices": Object {
                    "__typename": "CartItemPrices",
                    "price": Object {
                      "__typename": "Money",
                      "currency": "USD",
                      "value": 48,
                    },
                    "row_total": Object {
                      "__typename": "Money",
                      "value": 144,
                    },
                    "total_item_discount": Object {
                      "__typename": "Money",
                      "value": 0,
                    },
                  },
                  "product": Object {
                    "canonicalUrl": "antonia-infinity-scarf",
                    "mainImageUrl": "https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/609faca36a4bc16a754bc2f43c184970/v/a/va04-ll_main_2.jpg",
                    "name": "Antonia Infinity Scarf",
                    "pricing": Object {
                      "currencyCode": "USD",
                      "maximalPrice": 48,
                      "minimalPrice": 48,
                      "regularPrice": 48,
                    },
                    "productType": "ConfigurableProduct",
                    "sku": "VA04",
                  },
                  "quantity": 3,
                },
              ],
              "possibleOnepageCheckout": false,
              "prices": Object {
                "subtotalExcludingTax": Object {
                  "currency": "USD",
                  "value": 358,
                },
              },
            }
        `);

        expect(mockSdk.publish.shoppingCartView).toHaveBeenCalledTimes(1);

        expect(mockSdk.context.setPage).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setPage.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "eventType": "visibilityHidden",
              "maxXOffset": 0,
              "maxYOffset": 0,
              "minXOffset": 0,
              "minYOffset": 0,
              "pageName": "Cart",
              "pageType": "Cart",
            }
        `);

        expect(mockSdk.publish.pageView).toHaveBeenCalledTimes(1);
    });
});
