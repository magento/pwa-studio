import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { deleteCacheEntry } from '../deleteCacheEntry';

const log = jest.fn();

const persistor = {
    persist: jest.fn()
};

const ClientLessComponent = () => {
    const client = undefined;

    useEffect(() => {
        const deleteEntry = async () => {
            await deleteCacheEntry(client, key => key.match(/^\$?Cart/));
        };

        deleteEntry();
    }, [client]);
    return <i />;
};

const Component = props => {
    const { withPersistor = true } = props;
    const client = useApolloClient();

    if (withPersistor) {
        client.persistor = persistor;
    }

    const initialCacheKeys = Object.keys(client.cache.data.data);
    log(initialCacheKeys);

    useEffect(() => {
        const deleteEntry = async () => {
            await deleteCacheEntry(client, key => key.match(/^\$?Cart/));

            if (client) {
                const finalCacheKeys = Object.keys(client.cache.data.data);
                log(finalCacheKeys);
            }
        };

        deleteEntry();
    }, [client]);
    return <i />;
};

test('handle no client cache', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(console, 'warn');

    await act(async () => {
        TestRenderer.create(
            <MockedProvider>
                <ClientLessComponent />
            </MockedProvider>
        );
    });

    expect(spy).toHaveBeenCalledTimes(0);
});

test('handle no client cache in development', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(console, 'warn');

    process.env.NODE_ENV = 'development';

    await act(async () => {
        TestRenderer.create(
            <MockedProvider>
                <ClientLessComponent />
            </MockedProvider>
        );
    });

    expect(spy).toHaveBeenCalledTimes(1);
});

test('handle function call', async () => {
    expect.assertions(4);

    const spy = jest.spyOn(persistor, 'persist');

    const cache = new InMemoryCache({
        typePolicies
    });

    cache.restore({
        Cart: {
            id: '12345',
            total_quantity: '3'
        },
        Test: {
            value: 'Cached value'
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

    const initialKeys = log.mock.calls[0][0];
    expect(initialKeys).toEqual(['Cart', 'Test']);

    const finalKeys = log.mock.calls[1][0];
    expect(finalKeys).toEqual(['Test']);

    expect(spy).toHaveBeenCalledTimes(1);
});

test('handle function call with no persistor', async () => {
    expect.assertions(1);

    const spy = jest.spyOn(persistor, 'persist');

    await act(async () => {
        TestRenderer.create(
            <MockedProvider>
                <Component withPersistor={false} />
            </MockedProvider>
        );
    });

    expect(spy).toHaveBeenCalledTimes(0);
});
