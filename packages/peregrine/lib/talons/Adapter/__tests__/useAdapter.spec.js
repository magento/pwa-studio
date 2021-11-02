import React, { useEffect } from 'react';

import { createTestInstance } from '@magento/peregrine';
import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';
import { useAdapter } from '../useAdapter';

const log = jest.fn();

jest.mock('@apollo/client');
jest.mock('@apollo/client/cache');
jest.mock('@apollo/client/core');
jest.mock('@apollo/client/link/context');
jest.mock('@apollo/client/link/error');
jest.mock('@apollo/client/link/retry');
jest.mock('apollo-cache-persist');

let inputValues = {};

const Component = () => {
    const talonProps = useAdapter(inputValues);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        origin: 'https://example.com',
        store: 'default',
        styles: {}
    };

    process.env.NODE_ENV = 'development';
    process.env.USE_STORE_CODE_IN_URL = true;

    global.AVAILABLE_STORE_VIEWS = [
        {
            code: 'default'
        },
        {
            code: 'french'
        }
    ];

    globalThis.localStorage.setItem('signin_token', 'signin_token');
    globalThis.localStorage.setItem(
        'store_view_currency',
        'store_view_currency'
    );
    globalThis.localStorage.setItem('store_view_code', 'store_view_code');
    globalThis.localStorage.setItem(
        `${CACHE_PERSIST_PREFIX}-default`,
        '{"StoreConfig:1":{"id":1,"__typename":"StoreConfig","code":"default"}}'
    );
    globalThis.localStorage.setItem(
        `${CACHE_PERSIST_PREFIX}-french`,
        '{"StoreConfig:2":{"id":2,"__typename":"StoreConfig","code":"french"}}'
    );
};

describe('#useAdapter', () => {
    beforeEach(() => {
        log.mockClear();
        givenDefaultValues();
    });

    it('returns correct shape', async () => {
        await createTestInstance(<Component />);

        expect(log).toMatchInlineSnapshot(`
            [MockFunction] {
              "calls": Array [
                Array [
                  Object {
                    "apolloProps": Object {
                      "client": ApolloClient {
                        "__actionHookForDevTools": [MockFunction],
                        "__requestRaw": [MockFunction],
                        "addResolvers": [MockFunction],
                        "apiBase": "https://example.com/graphql",
                        "clearCacheData": [Function],
                        "clearStore": [MockFunction],
                        "extract": [MockFunction],
                        "getObservableQueries": [MockFunction],
                        "getResolvers": [MockFunction],
                        "mutate": [MockFunction],
                        "onClearStore": [MockFunction],
                        "onResetStore": [MockFunction],
                        "persistor": CachePersistor {
                          "getLogs": [MockFunction],
                          "getSize": [MockFunction],
                          "pause": [MockFunction],
                          "persist": [MockFunction],
                          "purge": [MockFunction],
                          "remove": [MockFunction],
                          "restore": [MockFunction] {
                            "calls": Array [
                              Array [],
                            ],
                            "results": Array [
                              Object {
                                "type": "return",
                                "value": undefined,
                              },
                            ],
                          },
                          "resume": [MockFunction],
                        },
                        "query": [MockFunction],
                        "reFetchObservableQueries": [MockFunction],
                        "readFragment": [MockFunction],
                        "readQuery": [MockFunction],
                        "refetchQueries": [MockFunction],
                        "resetStore": [MockFunction],
                        "restore": [MockFunction],
                        "setLink": [MockFunction],
                        "setLocalStateFragmentMatcher": [MockFunction],
                        "setResolvers": [MockFunction],
                        "stop": [MockFunction],
                        "subscribe": [MockFunction],
                        "watchQuery": [MockFunction],
                        "writeFragment": [MockFunction],
                        "writeQuery": [MockFunction],
                      },
                    },
                    "initialized": false,
                    "reduxProps": Object {
                      "store": "default",
                    },
                    "routerProps": Object {
                      "basename": null,
                      "getUserConfirmation": [Function],
                    },
                    "styleProps": Object {
                      "initialState": Object {},
                    },
                    "urlHasStoreCode": false,
                  },
                ],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": undefined,
                },
              ],
            }
        `);
    });
});
