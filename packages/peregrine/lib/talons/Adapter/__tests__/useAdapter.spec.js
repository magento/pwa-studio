import React, { useEffect } from 'react';

import { createTestInstance } from '@magento/peregrine';
import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';
import { useAdapter } from '../useAdapter';

const log = jest.fn();

jest.mock('@apollo/client', () => ({
    ApolloLink: {
        from: jest.fn(() => {})
    },
    createHttpLink: jest.fn(() => ({
        fetch: jest.fn(),
        useGETForQueries: jest.fn(),
        uri: jest.fn()
    }))
}));
jest.mock('@apollo/client/core', () => ({
    ApolloClient: jest.fn(() => ({
        persistor: jest.fn(() => {})
    }))
}));
jest.mock('apollo-cache-persist', () => ({
    CachePersistor: jest.fn(() => ({
        restore: jest.fn()
    }))
}));
jest.mock('@magento/peregrine/lib/Apollo/magentoGqlCacheLink', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {};
        })
    };
});

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

    global.AVAILABLE_STORE_VIEWS = [
        {
            code: 'default'
        },
        {
            code: 'french'
        }
    ];
    global.STORE_VIEW_CODE = 'default';

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

    it('returns correct shape', () => {
        createTestInstance(<Component />);

        expect(log).toMatchInlineSnapshot(`
            [MockFunction] {
              "calls": Array [
                Array [
                  Object {
                    "apolloProps": Object {
                      "client": Object {
                        "apiBase": "https://example.com/graphql",
                        "clearCacheData": [Function],
                        "persistor": Object {
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
                        },
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
