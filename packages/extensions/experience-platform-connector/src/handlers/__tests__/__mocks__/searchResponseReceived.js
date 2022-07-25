export const searchResponseEvent = {
    type: 'SEARCH_RESPONSE',
    payload: {
        categories: [
            {
                __typename: 'AggregationOption',
                label: 'Bottoms',
                value: '11'
            },
            {
                __typename: 'AggregationOption',
                label: 'Pants & Shorts',
                value: '12'
            }
        ],
        facets: [],
        page: 1,
        perPage: 3,
        products: [
            {
                __typename: 'ConfigurableProduct',
                id: 1144,
                uid: 'MTE0NA==',
                sku: 'VP01',
                name: 'Selena Pants',
                small_image: {
                    __typename: 'ProductImage',
                    url:
                        'https://beacon-rjroszy-vzsrtettsztvg.us-4.magentosite.cloud/media/catalog/product/cache/37f3b100da589f62b6681aad6ae5936f/v/p/vp01-ll_main_2.jpg'
                },
                url_key: 'selena-pants',
                url_suffix: '.html',
                price: {
                    __typename: 'ProductPrices',
                    regularPrice: {
                        __typename: 'Price',
                        amount: {
                            __typename: 'Money',
                            value: 108,
                            currency: 'USD'
                        }
                    }
                },
                price_range: {
                    __typename: 'PriceRange',
                    maximum_price: {
                        __typename: 'ProductPrice',
                        final_price: {
                            __typename: 'Money',
                            currency: 'USD',
                            value: 108
                        },
                        discount: {
                            __typename: 'ProductDiscount',
                            amount_off: 0
                        }
                    }
                }
            }
        ],
        searchRequestId: 'selena',
        searchUnitId: 'search-bar',
        suggestions: [
            {
                __typename: 'ConfigurableProduct',
                id: 1144,
                uid: 'MTE0NA==',
                sku: 'VP01',
                name: 'Selena Pants',
                small_image: {
                    __typename: 'ProductImage',
                    url:
                        'https://beacon-rjroszy-vzsrtettsztvg.us-4.magentosite.cloud/media/catalog/product/cache/37f3b100da589f62b6681aad6ae5936f/v/p/vp01-ll_main_2.jpg'
                },
                url_key: 'selena-pants',
                url_suffix: '.html',
                price: {
                    __typename: 'ProductPrices',
                    regularPrice: {
                        __typename: 'Price',
                        amount: {
                            __typename: 'Money',
                            value: 108,
                            currency: 'USD'
                        }
                    }
                },
                price_range: {
                    __typename: 'PriceRange',
                    maximum_price: {
                        __typename: 'ProductPrice',
                        final_price: {
                            __typename: 'Money',
                            currency: 'USD',
                            value: 108
                        },
                        discount: {
                            __typename: 'ProductDiscount',
                            amount_off: 0
                        }
                    }
                }
            }
        ]
    }
};
