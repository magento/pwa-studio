import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { clearCartDataFromCache } from '../clearCartDataFromCache';

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
        await clearCartDataFromCache(client);
        const finalCacheData = Object.assign({}, client.cache.data.data);
        log(finalCacheData);
    };

    useEffect(() => {
        clear();
    });
    return <i />;
};

test('clears cart data from cache without persistor', async () => {
    expect.assertions(3);
    const cache = new InMemoryCache({
        typePolicies
    });

    cache.restore({
        Cart: {
            __typename: 'Cart',
            id: '12345',
            total_quantity: '3',
            giftcard: { __ref: 'AppliedGiftCard' },
            shipping_address: { __ref: 'ShippingCartAddress' },
            available_shipping_methods: [{ __ref: 'AvailableShippingMethod' }]
        },
        AppliedGiftCard: {
            __typename: 'AppliedGiftCard',
            code: 'GiftCardCode'
        },
        ShippingCartAddress: {
            __typename: 'ShippingCartAddress',
            street: '747 Evergreen Terrace'
        },
        AvailableShippingMethod: {
            __typename: 'AvailableShippingMethod',
            carrier_code: '4',
            method_code: '5'
        },
        AnotherCacheEntry: {
            __typename: 'AnotherCacheEntry',
            value: 'This entry should not get deleted'
        },
        ROOT_QUERY: {
            __typename: 'Query',
            cart: { __ref: 'Cart' },
            anotherCacheEntry: { __ref: 'AnotherCacheEntry' }
        }
    });

    cache.retain('ROOT_QUERY');

    await act(async () => {
        TestRenderer.create(
            <MockedProvider cache={cache} addTypename={false}>
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
        'AnotherCacheEntry',
        'ROOT_QUERY'
    ]);

    const finalCacheDataKeys = Object.keys(log.mock.calls[1][0]);
    expect(finalCacheDataKeys).toEqual(['AnotherCacheEntry', 'ROOT_QUERY']);
});

test('clears cart data from cache with persistor', async () => {
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
