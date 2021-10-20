import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { clearCustomerDataFromCache } from '../clearCustomerDataFromCache';

const log = jest.fn();

const Component = () => {
    const client = useApolloClient();

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

test('clears customer data from cache', async () => {
    expect.assertions(3);
    const cache = new InMemoryCache({
        typePolicies
    });

    cache.restore({
        ROOT_QUERY: {
            anotherLocalField: 'This entry should not get deleted',
            customerLocalField: 'This entry should get deleted'
        },
        Customer: {
            id: 'customerId',
            firstName: 'Veronica'
        },
        AnotherCacheEntry: {
            value: 'This entry should not get deleted'
        }
    });

    await act(async () => {
        TestRenderer.create(
            <MockedProvider cache={cache}>
                <Component />
            </MockedProvider>
        );
    });

    expect(log).toHaveBeenCalledTimes(2);

    const initialCacheData = log.mock.calls[0][0];
    expect(initialCacheData).toMatchInlineSnapshot(`
        Object {
          "AnotherCacheEntry": Object {
            "value": "This entry should not get deleted",
          },
          "Customer": Object {
            "firstName": "Veronica",
            "id": "customerId",
          },
          "ROOT_QUERY": Object {
            "anotherLocalField": "This entry should not get deleted",
            "customerLocalField": "This entry should get deleted",
          },
        }
    `);

    const finalCacheData = log.mock.calls[1][0];
    expect(finalCacheData).toMatchInlineSnapshot(`
        Object {
          "AnotherCacheEntry": Object {
            "value": "This entry should not get deleted",
          },
          "ROOT_QUERY": Object {
            "anotherLocalField": "This entry should not get deleted",
          },
        }
    `);
});
