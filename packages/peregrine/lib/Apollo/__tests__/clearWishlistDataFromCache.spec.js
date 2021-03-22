import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { clearWishlistDataFromCache } from '../clearWishlistDataFromCache';

const log = jest.fn();

const Component = () => {
    const client = useApolloClient();

    const initialCacheData = Object.assign({}, client.cache.data.data);
    log(initialCacheData);

    const clear = async () => {
        await clearWishlistDataFromCache(client);
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
        Wishlist: {
            id: '42',
            name: 'Test'
        },
        ConfigurableWishlistItem: {
            id: '42'
        },
        SimpleWishlistItem: {
            id: '42'
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
        'Wishlist',
        'ConfigurableWishlistItem',
        'SimpleWishlistItem',
        'AnotherCacheEntry'
    ]);

    const finalCacheDataKeys = Object.keys(log.mock.calls[1][0]);
    expect(finalCacheDataKeys).toEqual(['AnotherCacheEntry']);
});
