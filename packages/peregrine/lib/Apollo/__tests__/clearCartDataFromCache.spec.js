import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { clearCartDataFromCache } from '../clearCartDataFromCache';

const persistor = {
    persistor: {
        storage: {
            key: 'unit test key'
        }
    },
    persist: jest.fn()
};

const log = jest.fn();

const Component = () => {
    const client = useApolloClient();
    client.persistor = persistor;

    const initialCacheData = Object.assign({}, client.cache.data.data);
    log(initialCacheData);

    const clear = async () => {
        await clearCartDataFromCache(client);
        const finalCacheData = Object.assign({}, client.cache.data.data);
        log(finalCacheData);
    };

    useEffect(() => {
        clear();
    });
    return <i />;
};

test('clears cart data from cache', async () => {
    expect.assertions(3);
    const cache = new InMemoryCache({
        typePolicies
    });

    cache.restore({
        Cart: {
            id: '12345',
            total_quantity: '3'
        },
        AppliedGiftCard: {
            code: 'GiftCardCode'
        },
        ShippingCartAddress: {
            street: '747 Evergreen Terrace'
        },
        AvailableShippingMethod: {
            carrier_code: '4',
            method_code: '5'
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

    const initialCacheDataKeys = Object.keys(log.mock.calls[0][0]);
    expect(initialCacheDataKeys).toEqual([
        'Cart',
        'AppliedGiftCard',
        'ShippingCartAddress',
        'AvailableShippingMethod',
        'AnotherCacheEntry'
    ]);

    const finalCacheDataKeys = Object.keys(log.mock.calls[1][0]);
    expect(finalCacheDataKeys).toEqual(['AnotherCacheEntry']);
});
