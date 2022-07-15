import handler from '../searchResponseReceived';
import { searchResponseEvent } from './__mocks__/searchResponseReceived';

describe('canHandle()', () => {
    it('returns true for the correct event type', () => {
        expect(handler.canHandle(searchResponseEvent)).toBeTruthy();
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
                setSearchResults: jest.fn()
            },
            publish: {
                searchResponseReceived: jest.fn()
            }
        };

        handler.handle(mockSdk, searchResponseEvent);

        expect(mockSdk.context.setSearchResults).toHaveBeenCalledTimes(1);
        expect(mockSdk.context.setSearchResults.mock.calls[0][0])
            .toMatchInlineSnapshot(`
            Object {
              "units": Array [
                Object {
                  "categories": Array [
                    Object {
                      "__typename": "AggregationOption",
                      "label": "Bottoms",
                      "value": "11",
                    },
                    Object {
                      "__typename": "AggregationOption",
                      "label": "Pants & Shorts",
                      "value": "12",
                    },
                  ],
                  "facets": Array [],
                  "page": 1,
                  "perPage": 3,
                  "products": Array [
                    Object {
                      "__typename": "ConfigurableProduct",
                      "id": 1144,
                      "name": "Selena Pants",
                      "price": Object {
                        "__typename": "ProductPrices",
                        "regularPrice": Object {
                          "__typename": "Price",
                          "amount": Object {
                            "__typename": "Money",
                            "currency": "USD",
                            "value": 108,
                          },
                        },
                      },
                      "price_range": Object {
                        "__typename": "PriceRange",
                        "maximum_price": Object {
                          "__typename": "ProductPrice",
                          "discount": Object {
                            "__typename": "ProductDiscount",
                            "amount_off": 0,
                          },
                          "final_price": Object {
                            "__typename": "Money",
                            "currency": "USD",
                            "value": 108,
                          },
                        },
                      },
                      "sku": "VP01",
                      "small_image": Object {
                        "__typename": "ProductImage",
                        "url": "https://beacon-rjroszy-vzsrtettsztvg.us-4.magentosite.cloud/media/catalog/product/cache/37f3b100da589f62b6681aad6ae5936f/v/p/vp01-ll_main_2.jpg",
                      },
                      "uid": "MTE0NA==",
                      "url_key": "selena-pants",
                      "url_suffix": ".html",
                    },
                  ],
                  "searchRequestId": "selena",
                  "searchUnitId": "search-bar",
                  "suggestions": Array [
                    Object {
                      "__typename": "ConfigurableProduct",
                      "id": 1144,
                      "name": "Selena Pants",
                      "price": Object {
                        "__typename": "ProductPrices",
                        "regularPrice": Object {
                          "__typename": "Price",
                          "amount": Object {
                            "__typename": "Money",
                            "currency": "USD",
                            "value": 108,
                          },
                        },
                      },
                      "price_range": Object {
                        "__typename": "PriceRange",
                        "maximum_price": Object {
                          "__typename": "ProductPrice",
                          "discount": Object {
                            "__typename": "ProductDiscount",
                            "amount_off": 0,
                          },
                          "final_price": Object {
                            "__typename": "Money",
                            "currency": "USD",
                            "value": 108,
                          },
                        },
                      },
                      "sku": "VP01",
                      "small_image": Object {
                        "__typename": "ProductImage",
                        "url": "https://beacon-rjroszy-vzsrtettsztvg.us-4.magentosite.cloud/media/catalog/product/cache/37f3b100da589f62b6681aad6ae5936f/v/p/vp01-ll_main_2.jpg",
                      },
                      "uid": "MTE0NA==",
                      "url_key": "selena-pants",
                      "url_suffix": ".html",
                    },
                  ],
                },
              ],
            }
        `);

        expect(mockSdk.publish.searchResponseReceived).toHaveBeenCalledTimes(1);
    });
});
