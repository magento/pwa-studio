import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';

import DEFAULT_OPERATIONS from '../cmsDynamicBlock.gql';
import { useCmsDynamicBlock } from '../useCmsDynamicBlock';

const mockCartId = 'cart123';
const mockLocations = 'location';
const mockProductId = 'productUid';
const mockUids = 'blockUid1';
const mockUrlKey = 'product-url';
const mockType = 'type';

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({ pathname: 'product-url.html' }))
}));

jest.mock('@magento/peregrine/lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: 'cart123' }])
}));

const getCmsDynamicBlocksMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getCmsDynamicBlocksQuery,
        variables: {
            cartId: mockCartId,
            type: mockType,
            locations: mockLocations,
            uids: mockUids
        }
    },
    result: {
        data: {
            dynamicBlocks: {
                items: [
                    {
                        content: {
                            html: '<mock-DynamicBlock />',
                            __typename: 'ComplexTextValue'
                        },
                        uid: 'blockUid1',
                        __typename: 'DynamicBlock'
                    }
                ],
                __typename: 'DynamicBlocks'
            }
        }
    }
};

const getCmsDynamicBlocksMock2 = {
    request: {
        query: DEFAULT_OPERATIONS.getCmsDynamicBlocksQuery,
        variables: {
            cartId: mockCartId,
            type: mockType,
            locations: mockLocations,
            uids: mockUids
        }
    },
    result: {
        data: {
            dynamicBlocks: {
                items: [
                    {
                        content: {
                            html: '<mock-DynamicBlock />',
                            __typename: 'ComplexTextValue'
                        },
                        uid: 'blockUid1',
                        __typename: 'DynamicBlock'
                    },
                    {
                        content: {
                            html: '<mock-DynamicBlock />',
                            __typename: 'ComplexTextValue'
                        },
                        uid: 'blockUid2',
                        __typename: 'DynamicBlock'
                    }
                ],
                __typename: 'DynamicBlocks'
            }
        }
    }
};

const getCmsDynamicBlocksMock3 = {
    request: {
        query: DEFAULT_OPERATIONS.getCmsDynamicBlocksQuery,
        variables: {
            cartId: mockCartId,
            type: mockType,
            locations: mockLocations,
            uids: mockUids,
            productId: mockProductId
        }
    },
    result: {
        data: {
            dynamicBlocks: {
                items: [
                    {
                        content: {
                            html: '<mock-DynamicBlock />',
                            __typename: 'ComplexTextValue'
                        },
                        uid: 'blockUid3',
                        __typename: 'DynamicBlock'
                    }
                ],
                __typename: 'DynamicBlocks'
            }
        }
    }
};

const getSalesRulesDataMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getSalesRulesDataQuery,
        variables: {
            cartId: mockCartId
        }
    },
    result: {
        data: {
            cart: {
                id: mockCartId,
                items: [],
                prices: {
                    subtotal_excluding_tax: { value: 0, __typename: 'Money' },
                    subtotal_including_tax: { value: 0, __typename: 'Money' },
                    __typename: 'CartPrices'
                },
                selected_payment_method: {
                    code: '',
                    __typename: 'SelectedPaymentMethod'
                },
                shipping_addresses: [],
                total_quantity: 0,
                __typename: 'Cart'
            }
        }
    }
};

const getSalesRulesDataMock2 = {
    query: DEFAULT_OPERATIONS.getSalesRulesDataQuery,
    variables: {
        cartId: mockCartId
    },
    data: {
        cart: {
            id: mockCartId,
            items: [
                {
                    uid: 'itemUid1',
                    product: {
                        uid: 'configurableProductUid1',
                        weight: null,
                        __typename: 'ConfigurableProduct'
                    },
                    quantity: 2,
                    configured_variant: {
                        uid: 'simpleProductUid1',
                        weight: 1,
                        __typename: 'SimpleProduct'
                    },
                    __typename: 'ConfigurableCartItem'
                },
                {
                    uid: 'itemUid2',
                    product: {
                        uid: 'simpleProductUid2',
                        weight: null,
                        __typename: 'SimpleProduct'
                    },
                    quantity: 1,
                    __typename: 'SimpleCartItem'
                }
            ],
            prices: {
                subtotal_excluding_tax: { value: 215, __typename: 'Money' },
                subtotal_including_tax: {
                    value: 232.74,
                    __typename: 'Money'
                },
                __typename: 'CartPrices'
            },
            selected_payment_method: {
                code: 'moneyorder',
                __typename: 'SelectedPaymentMethod'
            },
            shipping_addresses: [
                {
                    country: {
                        code: 'US',
                        __typename: 'CartAddressCountry'
                    },
                    postcode: '90210',
                    region: {
                        code: 'CA',
                        region_id: 12,
                        __typename: 'CartAddressRegion'
                    },
                    street: ['street'],
                    selected_shipping_method: {
                        method_code: 'flatrate',
                        __typename: 'SelectedShippingMethod'
                    },
                    __typename: 'ShippingCartAddress'
                }
            ],
            total_quantity: 3,
            __typename: 'Cart'
        }
    }
};

const getStoreConfigDataMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getStoreConfigData
    },
    result: {
        data: {
            storeConfig: {
                product_url_suffix: '.html'
            }
        }
    }
};

const getProductDetailDataMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getProductDetailQuery,
        variables: {
            urlKey: mockUrlKey
        }
    },
    result: {
        data: {
            products: {
                items: [
                    {
                        uid: mockProductId,
                        url_key: mockUrlKey
                    }
                ]
            }
        }
    }
};

const cache = new InMemoryCache({
    typePolicies
});

const initialProps = {
    locations: mockLocations,
    uids: mockUids,
    type: mockType
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [
        getCmsDynamicBlocksMock1,
        getCmsDynamicBlocksMock2,
        getSalesRulesDataMock1
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCmsDynamicBlock, { wrapper, ...renderHookOptions });
};

describe('#useCmsDynamicBlock', () => {
    beforeEach(() => {
        return cache.reset();
    });

    it('returns correct shape while and after loading and refetch after cart data update', async () => {
        const { result, waitForValueToChange } = renderHookWithProviders();

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "data": undefined,
              "error": undefined,
              "loading": true,
            }
        `);

        await waitForValueToChange(() => result.current.data);

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "dynamicBlocks": Object {
                  "__typename": "DynamicBlocks",
                  "items": Array [
                    Object {
                      "__typename": "DynamicBlock",
                      "content": Object {
                        "__typename": "ComplexTextValue",
                        "html": "<mock-DynamicBlock />",
                      },
                      "uid": "blockUid1",
                    },
                  ],
                  "salesRulesData": "[0,0,0,null,null,null,null,null,null,0]",
                },
              },
              "error": undefined,
              "loading": false,
            }
        `);

        // Update cart data to trigger a refetch
        cache.writeQuery(getSalesRulesDataMock2);

        await waitForValueToChange(() => result.current.data);

        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "dynamicBlocks": Object {
                  "__typename": "DynamicBlocks",
                  "items": Array [
                    Object {
                      "__typename": "DynamicBlock",
                      "content": Object {
                        "__typename": "ComplexTextValue",
                        "html": "<mock-DynamicBlock />",
                      },
                      "uid": "blockUid1",
                    },
                    Object {
                      "__typename": "DynamicBlock",
                      "content": Object {
                        "__typename": "ComplexTextValue",
                        "html": "<mock-DynamicBlock />",
                      },
                      "uid": "blockUid2",
                    },
                  ],
                  "salesRulesData": "[null,215,232.74,\\"moneyorder\\",\\"US\\",\\"90210\\",\\"CA\\",12,\\"flatrate\\",3]",
                },
              },
              "error": undefined,
              "loading": false,
            }
        `);
    });

    it('returns correct shape when on product detail page', async () => {
        const { result, waitForValueToChange } = renderHookWithProviders({
            mocks: [
                getCmsDynamicBlocksMock3,
                getStoreConfigDataMock1,
                getProductDetailDataMock1
            ]
        });

        await waitForValueToChange(() => result.current.data);

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "dynamicBlocks": Object {
                  "__typename": "DynamicBlocks",
                  "items": Array [
                    Object {
                      "__typename": "DynamicBlock",
                      "content": Object {
                        "__typename": "ComplexTextValue",
                        "html": "<mock-DynamicBlock />",
                      },
                      "uid": "blockUid3",
                    },
                  ],
                  "salesRulesData": "[0,0,0,null,null,null,null,null,null,0]",
                },
              },
              "error": undefined,
              "loading": false,
            }
        `);
    });
});
