import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { clearCustomerDataFromCache } from '../clearCustomerDataFromCache';

const log = jest.fn();
const mockPersist = jest.fn();

const Component = ({ clientOptions = {} }) => {
    const client = {
        ...useApolloClient(),
        ...clientOptions
    };

    const initialCacheData = Object.assign({}, client.cache.data.data);
    log(initialCacheData);

    const clear = async () => {
        await clearCustomerDataFromCache(client);
        const finalCacheData = Object.assign({}, client.cache.data.data);
        log(finalCacheData);
    };

    useEffect(() => {
        clear();
    });
    return <i />;
};

test('clears customer data from cache without persistor', async () => {
    expect.assertions(4);
    const cache = new InMemoryCache({
        typePolicies
    });

    cache.restore({
        ROOT_QUERY: {
            anotherLocalField: { __ref: 'AnotherCacheEntry' },
            customer: { __ref: 'Customer' },
            dynamicBlocks: { __ref: 'DynamicBlocks' }
        },
        Customer: {
            __typename: 'Customer',
            id: 'customerId',
            firstName: 'Veronica',
            orders: {
                items: [
                    {
                        __ref: 'CustomerOrder'
                    }
                ]
            }
        },
        CustomerOrder: {
            __typename: 'CustomerOrder',
            id: 'customerOrderId',
            items: [
                {
                    __ref: 'OrderItem'
                }
            ]
        },
        DynamicBlocks: {
            __typename: 'DynamicBlocks',
            items: [
                {
                    __ref: 'DynamicBlock'
                }
            ]
        },
        DynamicBlock: {
            __typename: 'DynamicBlock',
            uid: 'dynamicBlockUID'
        },
        OrderItem: {
            __typename: 'OrderItem',
            id: 'orderItemId',
            product_name: 'Product Name'
        },
        AnotherCacheEntry: {
            __typename: 'AnotherCacheEntry',
            value: 'This entry should not get deleted'
        }
    });

    cache.retain('ROOT_QUERY');

    await act(async () => {
        TestRenderer.create(
            <MockedProvider cache={cache}>
                <Component />
            </MockedProvider>
        );
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(mockPersist).not.toHaveBeenCalled();

    const initialCacheData = log.mock.calls[0][0];
    expect(initialCacheData).toMatchInlineSnapshot(`
        Object {
          "AnotherCacheEntry": Object {
            "__typename": "AnotherCacheEntry",
            "value": "This entry should not get deleted",
          },
          "Customer": Object {
            "__typename": "Customer",
            "firstName": "Veronica",
            "id": "customerId",
            "orders": Object {
              "items": Array [
                Object {
                  "__ref": "CustomerOrder",
                },
              ],
            },
          },
          "CustomerOrder": Object {
            "__typename": "CustomerOrder",
            "id": "customerOrderId",
            "items": Array [
              Object {
                "__ref": "OrderItem",
              },
            ],
          },
          "DynamicBlock": Object {
            "__typename": "DynamicBlock",
            "uid": "dynamicBlockUID",
          },
          "DynamicBlocks": Object {
            "__typename": "DynamicBlocks",
            "items": Array [
              Object {
                "__ref": "DynamicBlock",
              },
            ],
          },
          "OrderItem": Object {
            "__typename": "OrderItem",
            "id": "orderItemId",
            "product_name": "Product Name",
          },
          "ROOT_QUERY": Object {
            "anotherLocalField": Object {
              "__ref": "AnotherCacheEntry",
            },
            "customer": Object {
              "__ref": "Customer",
            },
            "dynamicBlocks": Object {
              "__ref": "DynamicBlocks",
            },
          },
        }
    `);

    const finalCacheData = log.mock.calls[1][0];
    expect(finalCacheData).toMatchInlineSnapshot(`
        Object {
          "AnotherCacheEntry": Object {
            "__typename": "AnotherCacheEntry",
            "value": "This entry should not get deleted",
          },
          "ROOT_QUERY": Object {
            "anotherLocalField": Object {
              "__ref": "AnotherCacheEntry",
            },
          },
        }
    `);
});

test('clears customer data from cache with persistor', async () => {
    const clientOptions = {
        persistor: {
            persist: mockPersist
        }
    };
    const cache = new InMemoryCache({
        typePolicies
    });

    await act(async () => {
        TestRenderer.create(
            <MockedProvider cache={cache}>
                <Component clientOptions={clientOptions} />
            </MockedProvider>
        );
    });

    expect(mockPersist).toHaveBeenCalled();
});
