import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient, InMemoryCache } from '@apollo/client';

import typePolicies from '../policies';

import { deleteCacheEntry } from '../deleteCacheEntry';

const log = jest.fn();

const persistor = {
    persistor: {
        storage: {
            key: 'unit test key'
        }
    },
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
        ROOT_QUERY: {
            CartLocalField: true
        },
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

    const initialCacheKeys = log.mock.calls[0][0];
    expect(initialCacheKeys).toMatchInlineSnapshot(`
        Array [
          "ROOT_QUERY",
          "Cart",
          "Test",
        ]
    `);

    const finalCacheKeys = log.mock.calls[1][0];
    expect(finalCacheKeys).toMatchInlineSnapshot(`
        Array [
          "Test",
        ]
    `);

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

describe('deleteInactiveCachesEntry', () => {
    let previousLocalStorage;
    const getItemMock = jest.fn();
    const setItemMock = jest.fn();
    const localStorageMock = (function() {
        const store = {
            'active apollo cache': JSON.stringify({ active: 'cache' }),
            'apollo-cache-persist-inactive': JSON.stringify({
                inactive: 'cache'
            }),
            'some-other-storage-key': JSON.stringify({ other: 'value' })
        };

        return {
            ...store,
            getItem: getItemMock,
            setItem: setItemMock
        };
    })();
    const client = {
        // Purposefully supply a falsy cache to early out of deleteActiveCacheEntry.
        cache: null,
        persistor: {
            persistor: {
                storage: {
                    key: 'active apollo cache'
                }
            }
        }
    };
    const predicate = jest.fn();

    beforeAll(() => {
        previousLocalStorage = window.localStorage;

        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
    });
    afterEach(() => {
        getItemMock.mockRestore();
        setItemMock.mockRestore();
        predicate.mockReset();
    });
    afterAll(() => {
        Object.defineProperty(window, 'localStorage', {
            value: previousLocalStorage,
            writable: true
        });
    });

    test('it bails when no client', async () => {
        // Arrange.
        const testClient = null;

        // Act.
        await deleteCacheEntry(testClient, predicate);

        // Assert.
        expect(predicate).not.toHaveBeenCalled();
    });

    test('it bails when no client persistor', async () => {
        // Arrange.
        const testClient = {};

        // Act.
        await deleteCacheEntry(testClient, predicate);

        // Assert.
        expect(predicate).not.toHaveBeenCalled();
    });

    test('only attempts to delete from inactive apollo caches', async () => {
        // Arrange.

        // Act.
        await deleteCacheEntry(client, predicate);

        // Assert.
        expect(setItemMock).toHaveBeenCalledTimes(1);
        // The key 'inactive' only appears in the inactive cache mock.
        expect(predicate).toHaveBeenCalledWith('inactive');
        expect(predicate).not.toHaveBeenCalledWith('active');
        expect(predicate).not.toHaveBeenCalledWith('other');
    });

    test('deletes keys that satisfy the predicate', async () => {
        // Arrange.
        predicate.mockReturnValue(true);

        // Act.
        await deleteCacheEntry(client, predicate);

        // Assert.
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenCalledWith(
            'apollo-cache-persist-inactive',
            '{}' // the only entry was deleted
        );
    });

    test('does not delete keys that dont satisfy the predicate', async () => {
        // Arrange.
        predicate.mockReturnValue(false);

        // Act.
        await deleteCacheEntry(client, predicate);

        // Assert.
        const previousValue = localStorageMock['apollo-cache-persist-inactive'];
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenCalledWith(
            'apollo-cache-persist-inactive',
            previousValue
        );
    });
});
