import React from 'react';
import { useApolloClient } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import defaultOperations from '../signIn.gql';
import { useSignIn } from '../useSignIn';
import { useEventingContext } from '../../../context/eventing';
import { useAwaitQuery } from '../../../hooks/useAwaitQuery';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useApolloClient: jest.fn()
    };
});
jest.mock('../../../hooks/useAwaitQuery', () => ({
    useAwaitQuery: jest.fn()
}));
jest.mock('../../../store/actions/cart', () => ({
    retrieveCartId: jest.fn().mockReturnValue('new-cart-id')
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([
        { cartId: 'old-cart-id' },
        {
            createCart: jest.fn(),
            removeCart: jest.fn(),
            getCartDetails: jest.fn()
        }
    ])
}));

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([
        {
            isGettingDetails: false,
            getDetailsError: 'getDetails error from redux'
        },
        { getUserDetails: jest.fn(), setToken: jest.fn() }
    ])
}));

jest.mock('../../../hooks/useGoogleReCaptcha', () => ({
    useGoogleReCaptcha: jest.fn().mockReturnValue({
        recaptchaLoading: false,
        generateReCaptchaData: jest.fn(() => {}),
        recaptchaWidgetProps: {}
    })
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const signInVariables = {
    email: 'fry@planetexpress.com',
    password: 'slurm is the best'
};
const authToken = 'auth-token-123';
const customerTokenLifetime = 3600;

const signInMock = {
    request: {
        query: defaultOperations.signInMutation,
        variables: signInVariables
    },
    result: {
        data: {
            generateCustomerToken: {
                token: authToken,
                customer_token_lifetime: customerTokenLifetime
            }
        }
    }
};

const mergeCartsMock = {
    request: {
        query: defaultOperations.mergeCartsMutation,
        variables: {
            destinationCartId: 'new-cart-id',
            sourceCartId: 'old-cart-id'
        }
    },
    result: {
        data: null
    }
};

const initialProps = {
    getCartDetailsQuery: 'getCartDetailsQuery',
    setDefaultUsername: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
    handleTriggerClick: jest.fn()
};

const clearCacheData = jest.fn();
const client = { clearCacheData };

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [signInMock, mergeCartsMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useSignIn, { wrapper, ...renderHookOptions });
};

beforeEach(() => {
    useApolloClient.mockReturnValue(client);
});

test('returns correct shape', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "cartContext": Array [
            Object {
              "cartId": "old-cart-id",
            },
            Object {
              "createCart": [MockFunction],
              "getCartDetails": [MockFunction],
              "removeCart": [MockFunction],
            },
          ],
          "errors": Map {
            "getUserDetailsQuery" => "getDetails error from redux",
            "signInMutation" => undefined,
          },
          "eventingContext": Array [
            Object {},
            Object {
              "dispatch": [MockFunction],
            },
          ],
          "fetchCartDetails": undefined,
          "fetchCartId": [Function],
          "fetchUserDetails": undefined,
          "forgotPasswordHandleEnterKeyPress": [Function],
          "googleReCaptcha": Object {
            "generateReCaptchaData": [Function],
            "recaptchaLoading": true,
            "recaptchaWidgetProps": Object {
              "containerElement": [Function],
              "shouldRender": false,
            },
          },
          "handleCreateAccount": [Function],
          "handleEnterKeyPress": [Function],
          "handleForgotPassword": [Function],
          "handleSubmit": [Function],
          "isBusy": true,
          "isSigningIn": false,
          "mergeCarts": [Function],
          "recaptchaWidgetProps": Object {
            "containerElement": [Function],
            "shouldRender": false,
          },
          "setFormApi": [Function],
          "setIsSigningIn": [Function],
          "signInMutationResult": Array [
            [Function],
            Object {
              "called": false,
              "client": ApolloClient {
                "cache": InMemoryCache {
                  "addTypename": false,
                  "config": Object {
                    "addTypename": false,
                    "canonizeResults": false,
                    "dataIdFromObject": [Function],
                    "resultCaching": true,
                  },
                  "data": Root {
                    "canRead": [Function],
                    "data": Object {},
                    "getFieldValue": [Function],
                    "group": CacheGroup {
                      "caching": true,
                      "d": [Function],
                      "keyMaker": Trie {
                        "makeData": [Function],
                        "weakness": true,
                      },
                      "parent": null,
                    },
                    "policies": Policies {
                      "cache": [Circular],
                      "config": Object {
                        "cache": [Circular],
                        "dataIdFromObject": [Function],
                        "possibleTypes": undefined,
                        "typePolicies": undefined,
                      },
                      "fuzzySubtypes": Map {},
                      "rootIdsByTypename": Object {
                        "Mutation": "ROOT_MUTATION",
                        "Query": "ROOT_QUERY",
                        "Subscription": "ROOT_SUBSCRIPTION",
                      },
                      "rootTypenamesById": Object {
                        "ROOT_MUTATION": "Mutation",
                        "ROOT_QUERY": "Query",
                        "ROOT_SUBSCRIPTION": "Subscription",
                      },
                      "supertypeMap": Map {},
                      "toBeAdded": Object {},
                      "typePolicies": Object {
                        "Query": Object {
                          "fields": Object {},
                        },
                      },
                      "usingPossibleTypes": false,
                    },
                    "refs": Object {},
                    "rootIds": Object {},
                    "storageTrie": Trie {
                      "makeData": [Function],
                      "weakness": true,
                    },
                    "stump": Stump {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                        "parent": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                      },
                      "id": "EntityStore.Stump",
                      "parent": [Circular],
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "replay": [Function],
                      "rootIds": Object {},
                      "toReference": [Function],
                    },
                    "toReference": [Function],
                  },
                  "evict": [Function],
                  "getFragmentDoc": [Function],
                  "makeVar": [Function],
                  "maybeBroadcastWatch": [Function],
                  "modify": [Function],
                  "optimisticData": Stump {
                    "canRead": [Function],
                    "data": Object {},
                    "getFieldValue": [Function],
                    "group": CacheGroup {
                      "caching": true,
                      "d": [Function],
                      "keyMaker": Trie {
                        "makeData": [Function],
                        "weak": WeakMap {},
                        "weakness": true,
                      },
                      "parent": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "parent": null,
                      },
                    },
                    "id": "EntityStore.Stump",
                    "parent": Root {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "parent": null,
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "rootIds": Object {},
                      "storageTrie": Trie {
                        "makeData": [Function],
                        "weakness": true,
                      },
                      "stump": [Circular],
                      "toReference": [Function],
                    },
                    "policies": Policies {
                      "cache": [Circular],
                      "config": Object {
                        "cache": [Circular],
                        "dataIdFromObject": [Function],
                        "possibleTypes": undefined,
                        "typePolicies": undefined,
                      },
                      "fuzzySubtypes": Map {},
                      "rootIdsByTypename": Object {
                        "Mutation": "ROOT_MUTATION",
                        "Query": "ROOT_QUERY",
                        "Subscription": "ROOT_SUBSCRIPTION",
                      },
                      "rootTypenamesById": Object {
                        "ROOT_MUTATION": "Mutation",
                        "ROOT_QUERY": "Query",
                        "ROOT_SUBSCRIPTION": "Subscription",
                      },
                      "supertypeMap": Map {},
                      "toBeAdded": Object {},
                      "typePolicies": Object {
                        "Query": Object {
                          "fields": Object {},
                        },
                      },
                      "usingPossibleTypes": false,
                    },
                    "refs": Object {},
                    "replay": [Function],
                    "rootIds": Object {},
                    "toReference": [Function],
                  },
                  "policies": Policies {
                    "cache": [Circular],
                    "config": Object {
                      "cache": [Circular],
                      "dataIdFromObject": [Function],
                      "possibleTypes": undefined,
                      "typePolicies": undefined,
                    },
                    "fuzzySubtypes": Map {},
                    "rootIdsByTypename": Object {
                      "Mutation": "ROOT_MUTATION",
                      "Query": "ROOT_QUERY",
                      "Subscription": "ROOT_SUBSCRIPTION",
                    },
                    "rootTypenamesById": Object {
                      "ROOT_MUTATION": "Mutation",
                      "ROOT_QUERY": "Query",
                      "ROOT_SUBSCRIPTION": "Subscription",
                    },
                    "supertypeMap": Map {},
                    "toBeAdded": Object {},
                    "typePolicies": Object {
                      "Query": Object {
                        "fields": Object {},
                      },
                    },
                    "usingPossibleTypes": false,
                  },
                  "reset": [Function],
                  "storeReader": StoreReader {
                    "canon": ObjectCanon {
                      "empty": Object {},
                      "keysByJSON": Map {
                        "[]" => Object {
                          "json": "[]",
                          "sorted": Array [],
                        },
                      },
                      "known": WeakSet {},
                      "passes": WeakMap {},
                      "pool": Trie {
                        "data": Object {
                          "keys": Object {
                            "json": "[]",
                            "sorted": Array [],
                          },
                        },
                        "makeData": [Function],
                        "weak": WeakMap {},
                        "weakness": true,
                      },
                    },
                    "config": Object {
                      "addTypename": false,
                      "cache": [Circular],
                      "canonizeResults": false,
                    },
                    "executeSelectionSet": [Function],
                    "executeSubSelectedArray": [Function],
                    "knownResults": WeakMap {},
                  },
                  "storeWriter": StoreWriter {
                    "cache": [Circular],
                    "reader": StoreReader {
                      "canon": ObjectCanon {
                        "empty": Object {},
                        "keysByJSON": Map {
                          "[]" => Object {
                            "json": "[]",
                            "sorted": Array [],
                          },
                        },
                        "known": WeakSet {},
                        "passes": WeakMap {},
                        "pool": Trie {
                          "data": Object {
                            "keys": Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                      },
                      "config": Object {
                        "addTypename": false,
                        "cache": [Circular],
                        "canonizeResults": false,
                      },
                      "executeSelectionSet": [Function],
                      "executeSubSelectedArray": [Function],
                      "knownResults": WeakMap {},
                    },
                  },
                  "txCount": 0,
                  "typenameDocumentCache": Map {},
                  "watches": Set {
                    Object {
                      "callback": [Function],
                      "canonizeResults": undefined,
                      "optimistic": true,
                      "query": Object {
                        "definitions": Array [
                          Object {
                            "directives": Array [],
                            "kind": "OperationDefinition",
                            "name": Object {
                              "kind": "Name",
                              "value": "GetReCaptchaV3Config",
                            },
                            "operation": "query",
                            "selectionSet": Object {
                              "kind": "SelectionSet",
                              "selections": Array [
                                Object {
                                  "alias": undefined,
                                  "arguments": Array [],
                                  "directives": Array [],
                                  "kind": "Field",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "recaptchaV3Config",
                                  },
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "website_key",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "badge_position",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "language_code",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "forms",
                                        },
                                        "selectionSet": undefined,
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                            "variableDefinitions": Array [],
                          },
                        ],
                        "kind": "Document",
                        "loc": Object {
                          "end": 173,
                          "start": 0,
                        },
                      },
                      "returnPartialData": true,
                      "variables": Object {},
                      "watcher": QueryInfo {
                        "cache": [Circular],
                        "cancel": [Function],
                        "dirty": false,
                        "document": Object {
                          "definitions": Array [
                            Object {
                              "directives": Array [],
                              "kind": "OperationDefinition",
                              "name": Object {
                                "kind": "Name",
                                "value": "GetReCaptchaV3Config",
                              },
                              "operation": "query",
                              "selectionSet": Object {
                                "kind": "SelectionSet",
                                "selections": Array [
                                  Object {
                                    "alias": undefined,
                                    "arguments": Array [],
                                    "directives": Array [],
                                    "kind": "Field",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "recaptchaV3Config",
                                    },
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "website_key",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "badge_position",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "language_code",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "forms",
                                          },
                                          "selectionSet": undefined,
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              "variableDefinitions": Array [],
                            },
                          ],
                          "kind": "Document",
                          "loc": Object {
                            "end": 173,
                            "start": 0,
                          },
                        },
                        "graphQLErrors": Array [],
                        "lastDiff": Object {
                          "diff": Object {
                            "complete": false,
                            "missing": Array [
                              MissingFieldError {
                                "message": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                "path": Object {
                                  "recaptchaV3Config": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                },
                                "query": Object {
                                  "definitions": Array [
                                    Object {
                                      "directives": Array [],
                                      "kind": "OperationDefinition",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "GetReCaptchaV3Config",
                                      },
                                      "operation": "query",
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "recaptchaV3Config",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "website_key",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "badge_position",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "language_code",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "forms",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                      "variableDefinitions": Array [],
                                    },
                                  ],
                                  "kind": "Document",
                                  "loc": Object {
                                    "end": 173,
                                    "start": 0,
                                  },
                                },
                                "variables": Object {},
                              },
                            ],
                            "result": Object {},
                          },
                          "options": Object {
                            "canonizeResults": undefined,
                            "optimistic": true,
                            "query": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "GetReCaptchaV3Config",
                                  },
                                  "operation": "query",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "recaptchaV3Config",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "website_key",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "badge_position",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "language_code",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "forms",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [],
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 173,
                                "start": 0,
                              },
                            },
                            "returnPartialData": true,
                            "variables": Object {},
                          },
                        },
                        "lastRequestId": 1,
                        "lastWatch": [Circular],
                        "listeners": Set {
                          [Function],
                        },
                        "networkError": null,
                        "networkStatus": 1,
                        "observableQuery": ObservableQuery {
                          "_subscriber": [Function],
                          "concast": Concast {
                            "_subscriber": [Function],
                            "addCount": 1,
                            "cancel": [Function],
                            "handlers": Object {
                              "complete": [Function],
                              "error": [Function],
                              "next": [Function],
                            },
                            "observers": Set {
                              Object {
                                "complete": [Function],
                                "error": [Function],
                                "next": [Function],
                              },
                              Object {
                                "error": [Function],
                                "next": [Function],
                              },
                            },
                            "promise": Promise {},
                            "reject": [Function],
                            "resolve": [Function],
                            "sources": Array [],
                            "sub": Subscription {
                              "_cleanup": [Function],
                              "_observer": Object {
                                "complete": [Function],
                                "error": [Function],
                                "next": [Function],
                              },
                              "_queue": undefined,
                              "_state": "ready",
                            },
                          },
                          "initialFetchPolicy": "cache-and-network",
                          "isTornDown": false,
                          "last": Object {
                            "result": Object {
                              "loading": true,
                              "networkStatus": 1,
                              "partial": true,
                            },
                            "variables": Object {},
                          },
                          "observer": Object {
                            "error": [Function],
                            "next": [Function],
                          },
                          "observers": Set {
                            SubscriptionObserver {
                              "_subscription": Subscription {
                                "_cleanup": [Function],
                                "_observer": Object {
                                  "complete": undefined,
                                  "error": [Function],
                                  "next": [Function],
                                },
                                "_queue": Array [
                                  Object {
                                    "type": "next",
                                    "value": Object {
                                      "loading": true,
                                      "networkStatus": 1,
                                      "partial": true,
                                    },
                                  },
                                ],
                                "_state": "buffering",
                              },
                            },
                          },
                          "options": Object {
                            "fetchPolicy": "cache-and-network",
                            "notifyOnNetworkStatusChange": false,
                            "query": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "GetReCaptchaV3Config",
                                  },
                                  "operation": "query",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "recaptchaV3Config",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "website_key",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "badge_position",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "language_code",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "forms",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [],
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 173,
                                "start": 0,
                              },
                            },
                            "variables": Object {},
                          },
                          "queryId": "1",
                          "queryInfo": [Circular],
                          "queryManager": QueryManager {
                            "assumeImmutableResults": false,
                            "cache": [Circular],
                            "clientAwareness": Object {
                              "name": undefined,
                              "version": undefined,
                            },
                            "fetchCancelFns": Map {
                              "1" => [Function],
                            },
                            "inFlightLinkObservables": Map {
                              Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              } => Map {
                                "{}" => Concast {
                                  "_subscriber": [Function],
                                  "addCount": 1,
                                  "cancel": [Function],
                                  "handlers": Object {
                                    "complete": [Function],
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                  "observers": Set {
                                    Object {
                                      "complete": [Function],
                                      "error": [Function],
                                      "next": [Function],
                                    },
                                    SubscriptionObserver {
                                      "_subscription": Subscription {
                                        "_cleanup": [Function],
                                        "_observer": Object {
                                          "complete": [Function],
                                          "error": [Function],
                                          "next": [Function],
                                        },
                                        "_queue": undefined,
                                        "_state": "ready",
                                      },
                                    },
                                  },
                                  "promise": Promise {},
                                  "reject": [Function],
                                  "resolve": [Function],
                                  "sources": Array [],
                                  "sub": Subscription {
                                    "_cleanup": [Function],
                                    "_observer": Object {
                                      "complete": [Function],
                                      "error": [Function],
                                      "next": [Function],
                                    },
                                    "_queue": undefined,
                                    "_state": "ready",
                                  },
                                },
                              },
                            },
                            "link": MockLink {
                              "addTypename": false,
                              "mockedResponsesByKey": Object {
                                "{\\"query\\":\\"mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!) {\\\\n  mergeCarts(\\\\n    source_cart_id: $sourceCartId\\\\n    destination_cart_id: $destinationCartId\\\\n  ) {\\\\n    id\\\\n    items {\\\\n      uid\\\\n    }\\\\n    ...CheckoutPageFragment\\\\n  }\\\\n}\\\\n\\\\nfragment CheckoutPageFragment on Cart {\\\\n  id\\\\n  items {\\\\n    uid\\\\n    product {\\\\n      uid\\\\n      stock_status\\\\n    }\\\\n  }\\\\n  total_quantity\\\\n  available_payment_methods {\\\\n    code\\\\n  }\\\\n}\\\\n\\"}": Array [
                                  Object {
                                    "request": Object {
                                      "query": Object {
                                        "definitions": Array [
                                          Object {
                                            "directives": Array [],
                                            "kind": "OperationDefinition",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "MergeCartsAfterSignIn",
                                            },
                                            "operation": "mutation",
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [
                                                    Object {
                                                      "kind": "Argument",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "source_cart_id",
                                                      },
                                                      "value": Object {
                                                        "kind": "Variable",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "sourceCartId",
                                                        },
                                                      },
                                                    },
                                                    Object {
                                                      "kind": "Argument",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "destination_cart_id",
                                                      },
                                                      "value": Object {
                                                        "kind": "Variable",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "destinationCartId",
                                                        },
                                                      },
                                                    },
                                                  ],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "mergeCarts",
                                                  },
                                                  "selectionSet": Object {
                                                    "kind": "SelectionSet",
                                                    "selections": Array [
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "id",
                                                        },
                                                        "selectionSet": undefined,
                                                      },
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "items",
                                                        },
                                                        "selectionSet": Object {
                                                          "kind": "SelectionSet",
                                                          "selections": Array [
                                                            Object {
                                                              "alias": undefined,
                                                              "arguments": Array [],
                                                              "directives": Array [],
                                                              "kind": "Field",
                                                              "name": Object {
                                                                "kind": "Name",
                                                                "value": "uid",
                                                              },
                                                              "selectionSet": undefined,
                                                            },
                                                          ],
                                                        },
                                                      },
                                                      Object {
                                                        "directives": Array [],
                                                        "kind": "FragmentSpread",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "CheckoutPageFragment",
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                            },
                                            "variableDefinitions": Array [
                                              Object {
                                                "defaultValue": undefined,
                                                "directives": Array [],
                                                "kind": "VariableDefinition",
                                                "type": Object {
                                                  "kind": "NonNullType",
                                                  "type": Object {
                                                    "kind": "NamedType",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "String",
                                                    },
                                                  },
                                                },
                                                "variable": Object {
                                                  "kind": "Variable",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "sourceCartId",
                                                  },
                                                },
                                              },
                                              Object {
                                                "defaultValue": undefined,
                                                "directives": Array [],
                                                "kind": "VariableDefinition",
                                                "type": Object {
                                                  "kind": "NonNullType",
                                                  "type": Object {
                                                    "kind": "NamedType",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "String",
                                                    },
                                                  },
                                                },
                                                "variable": Object {
                                                  "kind": "Variable",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "destinationCartId",
                                                  },
                                                },
                                              },
                                            ],
                                          },
                                          Object {
                                            "directives": Array [],
                                            "kind": "FragmentDefinition",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "CheckoutPageFragment",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "id",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "items",
                                                  },
                                                  "selectionSet": Object {
                                                    "kind": "SelectionSet",
                                                    "selections": Array [
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "uid",
                                                        },
                                                        "selectionSet": undefined,
                                                      },
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "product",
                                                        },
                                                        "selectionSet": Object {
                                                          "kind": "SelectionSet",
                                                          "selections": Array [
                                                            Object {
                                                              "alias": undefined,
                                                              "arguments": Array [],
                                                              "directives": Array [],
                                                              "kind": "Field",
                                                              "name": Object {
                                                                "kind": "Name",
                                                                "value": "uid",
                                                              },
                                                              "selectionSet": undefined,
                                                            },
                                                            Object {
                                                              "alias": undefined,
                                                              "arguments": Array [],
                                                              "directives": Array [],
                                                              "kind": "Field",
                                                              "name": Object {
                                                                "kind": "Name",
                                                                "value": "stock_status",
                                                              },
                                                              "selectionSet": undefined,
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "total_quantity",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "available_payment_methods",
                                                  },
                                                  "selectionSet": Object {
                                                    "kind": "SelectionSet",
                                                    "selections": Array [
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "code",
                                                        },
                                                        "selectionSet": undefined,
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                            },
                                            "typeCondition": Object {
                                              "kind": "NamedType",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "Cart",
                                              },
                                            },
                                          },
                                        ],
                                        "kind": "Document",
                                        "loc": Object {
                                          "end": 932,
                                          "start": 0,
                                        },
                                      },
                                      "variables": Object {
                                        "destinationCartId": "new-cart-id",
                                        "sourceCartId": "old-cart-id",
                                      },
                                    },
                                    "result": Object {
                                      "data": null,
                                    },
                                  },
                                ],
                                "{\\"query\\":\\"mutation SignIn($email: String!, $password: String!) {\\\\n  generateCustomerToken(email: $email, password: $password) {\\\\n    token\\\\n    customer_token_lifetime\\\\n  }\\\\n}\\\\n\\"}": Array [
                                  Object {
                                    "request": Object {
                                      "query": Object {
                                        "definitions": Array [
                                          Object {
                                            "directives": Array [],
                                            "kind": "OperationDefinition",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "SignIn",
                                            },
                                            "operation": "mutation",
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [
                                                    Object {
                                                      "kind": "Argument",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "email",
                                                      },
                                                      "value": Object {
                                                        "kind": "Variable",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "email",
                                                        },
                                                      },
                                                    },
                                                    Object {
                                                      "kind": "Argument",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "password",
                                                      },
                                                      "value": Object {
                                                        "kind": "Variable",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "password",
                                                        },
                                                      },
                                                    },
                                                  ],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "generateCustomerToken",
                                                  },
                                                  "selectionSet": Object {
                                                    "kind": "SelectionSet",
                                                    "selections": Array [
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "token",
                                                        },
                                                        "selectionSet": undefined,
                                                      },
                                                      Object {
                                                        "alias": undefined,
                                                        "arguments": Array [],
                                                        "directives": Array [],
                                                        "kind": "Field",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "customer_token_lifetime",
                                                        },
                                                        "selectionSet": undefined,
                                                      },
                                                    ],
                                                  },
                                                },
                                              ],
                                            },
                                            "variableDefinitions": Array [
                                              Object {
                                                "defaultValue": undefined,
                                                "directives": Array [],
                                                "kind": "VariableDefinition",
                                                "type": Object {
                                                  "kind": "NonNullType",
                                                  "type": Object {
                                                    "kind": "NamedType",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "String",
                                                    },
                                                  },
                                                },
                                                "variable": Object {
                                                  "kind": "Variable",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "email",
                                                  },
                                                },
                                              },
                                              Object {
                                                "defaultValue": undefined,
                                                "directives": Array [],
                                                "kind": "VariableDefinition",
                                                "type": Object {
                                                  "kind": "NonNullType",
                                                  "type": Object {
                                                    "kind": "NamedType",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "String",
                                                    },
                                                  },
                                                },
                                                "variable": Object {
                                                  "kind": "Variable",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "password",
                                                  },
                                                },
                                              },
                                            ],
                                          },
                                        ],
                                        "kind": "Document",
                                        "loc": Object {
                                          "end": 198,
                                          "start": 0,
                                        },
                                      },
                                      "variables": Object {
                                        "email": "fry@planetexpress.com",
                                        "password": "slurm is the best",
                                      },
                                    },
                                    "result": Object {
                                      "data": Object {
                                        "generateCustomerToken": Object {
                                          "customer_token_lifetime": 3600,
                                          "token": "auth-token-123",
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                              "operation": Object {
                                "extensions": Object {},
                                "operationName": "GetReCaptchaV3Config",
                                "query": Object {
                                  "definitions": Array [
                                    Object {
                                      "directives": Array [],
                                      "kind": "OperationDefinition",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "GetReCaptchaV3Config",
                                      },
                                      "operation": "query",
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "recaptchaV3Config",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "website_key",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "badge_position",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "language_code",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "forms",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                      "variableDefinitions": Array [],
                                    },
                                  ],
                                  "kind": "Document",
                                  "loc": Object {
                                    "end": 173,
                                    "start": 0,
                                  },
                                },
                                "variables": Object {},
                              },
                            },
                            "localState": LocalState {
                              "cache": [Circular],
                              "client": [Circular],
                            },
                            "mutationIdCounter": 1,
                            "mutationStore": Object {},
                            "onBroadcast": [Function],
                            "queries": Map {
                              "1" => [Circular],
                            },
                            "queryDeduplication": true,
                            "queryIdCounter": 2,
                            "requestIdCounter": 2,
                            "ssrMode": false,
                            "transformCache": WeakMap {},
                          },
                          "queryName": "GetReCaptchaV3Config",
                          "subscriptions": Set {},
                        },
                        "oqListener": [Function],
                        "queryId": "1",
                        "stopped": false,
                        "subscriptions": Set {},
                        "variables": Object {},
                      },
                    },
                  },
                },
                "clearStoreCallbacks": Array [],
                "defaultOptions": Object {},
                "disableNetworkFetches": false,
                "link": MockLink {
                  "addTypename": false,
                  "mockedResponsesByKey": Object {
                    "{\\"query\\":\\"mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!) {\\\\n  mergeCarts(\\\\n    source_cart_id: $sourceCartId\\\\n    destination_cart_id: $destinationCartId\\\\n  ) {\\\\n    id\\\\n    items {\\\\n      uid\\\\n    }\\\\n    ...CheckoutPageFragment\\\\n  }\\\\n}\\\\n\\\\nfragment CheckoutPageFragment on Cart {\\\\n  id\\\\n  items {\\\\n    uid\\\\n    product {\\\\n      uid\\\\n      stock_status\\\\n    }\\\\n  }\\\\n  total_quantity\\\\n  available_payment_methods {\\\\n    code\\\\n  }\\\\n}\\\\n\\"}": Array [
                      Object {
                        "request": Object {
                          "query": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "MergeCartsAfterSignIn",
                                },
                                "operation": "mutation",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [
                                        Object {
                                          "kind": "Argument",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "source_cart_id",
                                          },
                                          "value": Object {
                                            "kind": "Variable",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "sourceCartId",
                                            },
                                          },
                                        },
                                        Object {
                                          "kind": "Argument",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "destination_cart_id",
                                          },
                                          "value": Object {
                                            "kind": "Variable",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "destinationCartId",
                                            },
                                          },
                                        },
                                      ],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "mergeCarts",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "id",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "items",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "uid",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                          Object {
                                            "directives": Array [],
                                            "kind": "FragmentSpread",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "CheckoutPageFragment",
                                            },
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [
                                  Object {
                                    "defaultValue": undefined,
                                    "directives": Array [],
                                    "kind": "VariableDefinition",
                                    "type": Object {
                                      "kind": "NonNullType",
                                      "type": Object {
                                        "kind": "NamedType",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "String",
                                        },
                                      },
                                    },
                                    "variable": Object {
                                      "kind": "Variable",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "sourceCartId",
                                      },
                                    },
                                  },
                                  Object {
                                    "defaultValue": undefined,
                                    "directives": Array [],
                                    "kind": "VariableDefinition",
                                    "type": Object {
                                      "kind": "NonNullType",
                                      "type": Object {
                                        "kind": "NamedType",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "String",
                                        },
                                      },
                                    },
                                    "variable": Object {
                                      "kind": "Variable",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "destinationCartId",
                                      },
                                    },
                                  },
                                ],
                              },
                              Object {
                                "directives": Array [],
                                "kind": "FragmentDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "CheckoutPageFragment",
                                },
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "id",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "items",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "uid",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "product",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "uid",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "stock_status",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "total_quantity",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "available_payment_methods",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "typeCondition": Object {
                                  "kind": "NamedType",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "Cart",
                                  },
                                },
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 932,
                              "start": 0,
                            },
                          },
                          "variables": Object {
                            "destinationCartId": "new-cart-id",
                            "sourceCartId": "old-cart-id",
                          },
                        },
                        "result": Object {
                          "data": null,
                        },
                      },
                    ],
                    "{\\"query\\":\\"mutation SignIn($email: String!, $password: String!) {\\\\n  generateCustomerToken(email: $email, password: $password) {\\\\n    token\\\\n    customer_token_lifetime\\\\n  }\\\\n}\\\\n\\"}": Array [
                      Object {
                        "request": Object {
                          "query": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "SignIn",
                                },
                                "operation": "mutation",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [
                                        Object {
                                          "kind": "Argument",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "email",
                                          },
                                          "value": Object {
                                            "kind": "Variable",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "email",
                                            },
                                          },
                                        },
                                        Object {
                                          "kind": "Argument",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "password",
                                          },
                                          "value": Object {
                                            "kind": "Variable",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "password",
                                            },
                                          },
                                        },
                                      ],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "generateCustomerToken",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "token",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "customer_token_lifetime",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [
                                  Object {
                                    "defaultValue": undefined,
                                    "directives": Array [],
                                    "kind": "VariableDefinition",
                                    "type": Object {
                                      "kind": "NonNullType",
                                      "type": Object {
                                        "kind": "NamedType",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "String",
                                        },
                                      },
                                    },
                                    "variable": Object {
                                      "kind": "Variable",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "email",
                                      },
                                    },
                                  },
                                  Object {
                                    "defaultValue": undefined,
                                    "directives": Array [],
                                    "kind": "VariableDefinition",
                                    "type": Object {
                                      "kind": "NonNullType",
                                      "type": Object {
                                        "kind": "NamedType",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "String",
                                        },
                                      },
                                    },
                                    "variable": Object {
                                      "kind": "Variable",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "password",
                                      },
                                    },
                                  },
                                ],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 198,
                              "start": 0,
                            },
                          },
                          "variables": Object {
                            "email": "fry@planetexpress.com",
                            "password": "slurm is the best",
                          },
                        },
                        "result": Object {
                          "data": Object {
                            "generateCustomerToken": Object {
                              "customer_token_lifetime": 3600,
                              "token": "auth-token-123",
                            },
                          },
                        },
                      },
                    ],
                  },
                  "operation": Object {
                    "extensions": Object {},
                    "operationName": "GetReCaptchaV3Config",
                    "query": Object {
                      "definitions": Array [
                        Object {
                          "directives": Array [],
                          "kind": "OperationDefinition",
                          "name": Object {
                            "kind": "Name",
                            "value": "GetReCaptchaV3Config",
                          },
                          "operation": "query",
                          "selectionSet": Object {
                            "kind": "SelectionSet",
                            "selections": Array [
                              Object {
                                "alias": undefined,
                                "arguments": Array [],
                                "directives": Array [],
                                "kind": "Field",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "recaptchaV3Config",
                                },
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "website_key",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "badge_position",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "language_code",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "forms",
                                      },
                                      "selectionSet": undefined,
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          "variableDefinitions": Array [],
                        },
                      ],
                      "kind": "Document",
                      "loc": Object {
                        "end": 173,
                        "start": 0,
                      },
                    },
                    "variables": Object {},
                  },
                },
                "localState": LocalState {
                  "cache": InMemoryCache {
                    "addTypename": false,
                    "config": Object {
                      "addTypename": false,
                      "canonizeResults": false,
                      "dataIdFromObject": [Function],
                      "resultCaching": true,
                    },
                    "data": Root {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "parent": null,
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "rootIds": Object {},
                      "storageTrie": Trie {
                        "makeData": [Function],
                        "weakness": true,
                      },
                      "stump": Stump {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                          "parent": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "parent": null,
                          },
                        },
                        "id": "EntityStore.Stump",
                        "parent": [Circular],
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "replay": [Function],
                        "rootIds": Object {},
                        "toReference": [Function],
                      },
                      "toReference": [Function],
                    },
                    "evict": [Function],
                    "getFragmentDoc": [Function],
                    "makeVar": [Function],
                    "maybeBroadcastWatch": [Function],
                    "modify": [Function],
                    "optimisticData": Stump {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                        "parent": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                      },
                      "id": "EntityStore.Stump",
                      "parent": Root {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "rootIds": Object {},
                        "storageTrie": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "stump": [Circular],
                        "toReference": [Function],
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "replay": [Function],
                      "rootIds": Object {},
                      "toReference": [Function],
                    },
                    "policies": Policies {
                      "cache": [Circular],
                      "config": Object {
                        "cache": [Circular],
                        "dataIdFromObject": [Function],
                        "possibleTypes": undefined,
                        "typePolicies": undefined,
                      },
                      "fuzzySubtypes": Map {},
                      "rootIdsByTypename": Object {
                        "Mutation": "ROOT_MUTATION",
                        "Query": "ROOT_QUERY",
                        "Subscription": "ROOT_SUBSCRIPTION",
                      },
                      "rootTypenamesById": Object {
                        "ROOT_MUTATION": "Mutation",
                        "ROOT_QUERY": "Query",
                        "ROOT_SUBSCRIPTION": "Subscription",
                      },
                      "supertypeMap": Map {},
                      "toBeAdded": Object {},
                      "typePolicies": Object {
                        "Query": Object {
                          "fields": Object {},
                        },
                      },
                      "usingPossibleTypes": false,
                    },
                    "reset": [Function],
                    "storeReader": StoreReader {
                      "canon": ObjectCanon {
                        "empty": Object {},
                        "keysByJSON": Map {
                          "[]" => Object {
                            "json": "[]",
                            "sorted": Array [],
                          },
                        },
                        "known": WeakSet {},
                        "passes": WeakMap {},
                        "pool": Trie {
                          "data": Object {
                            "keys": Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                      },
                      "config": Object {
                        "addTypename": false,
                        "cache": [Circular],
                        "canonizeResults": false,
                      },
                      "executeSelectionSet": [Function],
                      "executeSubSelectedArray": [Function],
                      "knownResults": WeakMap {},
                    },
                    "storeWriter": StoreWriter {
                      "cache": [Circular],
                      "reader": StoreReader {
                        "canon": ObjectCanon {
                          "empty": Object {},
                          "keysByJSON": Map {
                            "[]" => Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "known": WeakSet {},
                          "passes": WeakMap {},
                          "pool": Trie {
                            "data": Object {
                              "keys": Object {
                                "json": "[]",
                                "sorted": Array [],
                              },
                            },
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                        },
                        "config": Object {
                          "addTypename": false,
                          "cache": [Circular],
                          "canonizeResults": false,
                        },
                        "executeSelectionSet": [Function],
                        "executeSubSelectedArray": [Function],
                        "knownResults": WeakMap {},
                      },
                    },
                    "txCount": 0,
                    "typenameDocumentCache": Map {},
                    "watches": Set {
                      Object {
                        "callback": [Function],
                        "canonizeResults": undefined,
                        "optimistic": true,
                        "query": Object {
                          "definitions": Array [
                            Object {
                              "directives": Array [],
                              "kind": "OperationDefinition",
                              "name": Object {
                                "kind": "Name",
                                "value": "GetReCaptchaV3Config",
                              },
                              "operation": "query",
                              "selectionSet": Object {
                                "kind": "SelectionSet",
                                "selections": Array [
                                  Object {
                                    "alias": undefined,
                                    "arguments": Array [],
                                    "directives": Array [],
                                    "kind": "Field",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "recaptchaV3Config",
                                    },
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "website_key",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "badge_position",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "language_code",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "forms",
                                          },
                                          "selectionSet": undefined,
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              "variableDefinitions": Array [],
                            },
                          ],
                          "kind": "Document",
                          "loc": Object {
                            "end": 173,
                            "start": 0,
                          },
                        },
                        "returnPartialData": true,
                        "variables": Object {},
                        "watcher": QueryInfo {
                          "cache": [Circular],
                          "cancel": [Function],
                          "dirty": false,
                          "document": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "GetReCaptchaV3Config",
                                },
                                "operation": "query",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "recaptchaV3Config",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "website_key",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "badge_position",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "language_code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "forms",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 173,
                              "start": 0,
                            },
                          },
                          "graphQLErrors": Array [],
                          "lastDiff": Object {
                            "diff": Object {
                              "complete": false,
                              "missing": Array [
                                MissingFieldError {
                                  "message": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                  "path": Object {
                                    "recaptchaV3Config": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                  },
                                  "query": Object {
                                    "definitions": Array [
                                      Object {
                                        "directives": Array [],
                                        "kind": "OperationDefinition",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "GetReCaptchaV3Config",
                                        },
                                        "operation": "query",
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "recaptchaV3Config",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "website_key",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "badge_position",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "language_code",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "forms",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                        "variableDefinitions": Array [],
                                      },
                                    ],
                                    "kind": "Document",
                                    "loc": Object {
                                      "end": 173,
                                      "start": 0,
                                    },
                                  },
                                  "variables": Object {},
                                },
                              ],
                              "result": Object {},
                            },
                            "options": Object {
                              "canonizeResults": undefined,
                              "optimistic": true,
                              "query": Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              },
                              "returnPartialData": true,
                              "variables": Object {},
                            },
                          },
                          "lastRequestId": 1,
                          "lastWatch": [Circular],
                          "listeners": Set {
                            [Function],
                          },
                          "networkError": null,
                          "networkStatus": 1,
                          "observableQuery": ObservableQuery {
                            "_subscriber": [Function],
                            "concast": Concast {
                              "_subscriber": [Function],
                              "addCount": 1,
                              "cancel": [Function],
                              "handlers": Object {
                                "complete": [Function],
                                "error": [Function],
                                "next": [Function],
                              },
                              "observers": Set {
                                Object {
                                  "complete": [Function],
                                  "error": [Function],
                                  "next": [Function],
                                },
                                Object {
                                  "error": [Function],
                                  "next": [Function],
                                },
                              },
                              "promise": Promise {},
                              "reject": [Function],
                              "resolve": [Function],
                              "sources": Array [],
                              "sub": Subscription {
                                "_cleanup": [Function],
                                "_observer": Object {
                                  "complete": [Function],
                                  "error": [Function],
                                  "next": [Function],
                                },
                                "_queue": undefined,
                                "_state": "ready",
                              },
                            },
                            "initialFetchPolicy": "cache-and-network",
                            "isTornDown": false,
                            "last": Object {
                              "result": Object {
                                "loading": true,
                                "networkStatus": 1,
                                "partial": true,
                              },
                              "variables": Object {},
                            },
                            "observer": Object {
                              "error": [Function],
                              "next": [Function],
                            },
                            "observers": Set {
                              SubscriptionObserver {
                                "_subscription": Subscription {
                                  "_cleanup": [Function],
                                  "_observer": Object {
                                    "complete": undefined,
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                  "_queue": Array [
                                    Object {
                                      "type": "next",
                                      "value": Object {
                                        "loading": true,
                                        "networkStatus": 1,
                                        "partial": true,
                                      },
                                    },
                                  ],
                                  "_state": "buffering",
                                },
                              },
                            },
                            "options": Object {
                              "fetchPolicy": "cache-and-network",
                              "notifyOnNetworkStatusChange": false,
                              "query": Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              },
                              "variables": Object {},
                            },
                            "queryId": "1",
                            "queryInfo": [Circular],
                            "queryManager": QueryManager {
                              "assumeImmutableResults": false,
                              "cache": [Circular],
                              "clientAwareness": Object {
                                "name": undefined,
                                "version": undefined,
                              },
                              "fetchCancelFns": Map {
                                "1" => [Function],
                              },
                              "inFlightLinkObservables": Map {
                                Object {
                                  "definitions": Array [
                                    Object {
                                      "directives": Array [],
                                      "kind": "OperationDefinition",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "GetReCaptchaV3Config",
                                      },
                                      "operation": "query",
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "recaptchaV3Config",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "website_key",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "badge_position",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "language_code",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "forms",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                      "variableDefinitions": Array [],
                                    },
                                  ],
                                  "kind": "Document",
                                  "loc": Object {
                                    "end": 173,
                                    "start": 0,
                                  },
                                } => Map {
                                  "{}" => Concast {
                                    "_subscriber": [Function],
                                    "addCount": 1,
                                    "cancel": [Function],
                                    "handlers": Object {
                                      "complete": [Function],
                                      "error": [Function],
                                      "next": [Function],
                                    },
                                    "observers": Set {
                                      Object {
                                        "complete": [Function],
                                        "error": [Function],
                                        "next": [Function],
                                      },
                                      SubscriptionObserver {
                                        "_subscription": Subscription {
                                          "_cleanup": [Function],
                                          "_observer": Object {
                                            "complete": [Function],
                                            "error": [Function],
                                            "next": [Function],
                                          },
                                          "_queue": undefined,
                                          "_state": "ready",
                                        },
                                      },
                                    },
                                    "promise": Promise {},
                                    "reject": [Function],
                                    "resolve": [Function],
                                    "sources": Array [],
                                    "sub": Subscription {
                                      "_cleanup": [Function],
                                      "_observer": Object {
                                        "complete": [Function],
                                        "error": [Function],
                                        "next": [Function],
                                      },
                                      "_queue": undefined,
                                      "_state": "ready",
                                    },
                                  },
                                },
                              },
                              "link": MockLink {
                                "addTypename": false,
                                "mockedResponsesByKey": Object {
                                  "{\\"query\\":\\"mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!) {\\\\n  mergeCarts(\\\\n    source_cart_id: $sourceCartId\\\\n    destination_cart_id: $destinationCartId\\\\n  ) {\\\\n    id\\\\n    items {\\\\n      uid\\\\n    }\\\\n    ...CheckoutPageFragment\\\\n  }\\\\n}\\\\n\\\\nfragment CheckoutPageFragment on Cart {\\\\n  id\\\\n  items {\\\\n    uid\\\\n    product {\\\\n      uid\\\\n      stock_status\\\\n    }\\\\n  }\\\\n  total_quantity\\\\n  available_payment_methods {\\\\n    code\\\\n  }\\\\n}\\\\n\\"}": Array [
                                    Object {
                                      "request": Object {
                                        "query": Object {
                                          "definitions": Array [
                                            Object {
                                              "directives": Array [],
                                              "kind": "OperationDefinition",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "MergeCartsAfterSignIn",
                                              },
                                              "operation": "mutation",
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [
                                                      Object {
                                                        "kind": "Argument",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "source_cart_id",
                                                        },
                                                        "value": Object {
                                                          "kind": "Variable",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "sourceCartId",
                                                          },
                                                        },
                                                      },
                                                      Object {
                                                        "kind": "Argument",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "destination_cart_id",
                                                        },
                                                        "value": Object {
                                                          "kind": "Variable",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "destinationCartId",
                                                          },
                                                        },
                                                      },
                                                    ],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "mergeCarts",
                                                    },
                                                    "selectionSet": Object {
                                                      "kind": "SelectionSet",
                                                      "selections": Array [
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "id",
                                                          },
                                                          "selectionSet": undefined,
                                                        },
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "items",
                                                          },
                                                          "selectionSet": Object {
                                                            "kind": "SelectionSet",
                                                            "selections": Array [
                                                              Object {
                                                                "alias": undefined,
                                                                "arguments": Array [],
                                                                "directives": Array [],
                                                                "kind": "Field",
                                                                "name": Object {
                                                                  "kind": "Name",
                                                                  "value": "uid",
                                                                },
                                                                "selectionSet": undefined,
                                                              },
                                                            ],
                                                          },
                                                        },
                                                        Object {
                                                          "directives": Array [],
                                                          "kind": "FragmentSpread",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "CheckoutPageFragment",
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                              "variableDefinitions": Array [
                                                Object {
                                                  "defaultValue": undefined,
                                                  "directives": Array [],
                                                  "kind": "VariableDefinition",
                                                  "type": Object {
                                                    "kind": "NonNullType",
                                                    "type": Object {
                                                      "kind": "NamedType",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "String",
                                                      },
                                                    },
                                                  },
                                                  "variable": Object {
                                                    "kind": "Variable",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "sourceCartId",
                                                    },
                                                  },
                                                },
                                                Object {
                                                  "defaultValue": undefined,
                                                  "directives": Array [],
                                                  "kind": "VariableDefinition",
                                                  "type": Object {
                                                    "kind": "NonNullType",
                                                    "type": Object {
                                                      "kind": "NamedType",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "String",
                                                      },
                                                    },
                                                  },
                                                  "variable": Object {
                                                    "kind": "Variable",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "destinationCartId",
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                            Object {
                                              "directives": Array [],
                                              "kind": "FragmentDefinition",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "CheckoutPageFragment",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "id",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "items",
                                                    },
                                                    "selectionSet": Object {
                                                      "kind": "SelectionSet",
                                                      "selections": Array [
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "uid",
                                                          },
                                                          "selectionSet": undefined,
                                                        },
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "product",
                                                          },
                                                          "selectionSet": Object {
                                                            "kind": "SelectionSet",
                                                            "selections": Array [
                                                              Object {
                                                                "alias": undefined,
                                                                "arguments": Array [],
                                                                "directives": Array [],
                                                                "kind": "Field",
                                                                "name": Object {
                                                                  "kind": "Name",
                                                                  "value": "uid",
                                                                },
                                                                "selectionSet": undefined,
                                                              },
                                                              Object {
                                                                "alias": undefined,
                                                                "arguments": Array [],
                                                                "directives": Array [],
                                                                "kind": "Field",
                                                                "name": Object {
                                                                  "kind": "Name",
                                                                  "value": "stock_status",
                                                                },
                                                                "selectionSet": undefined,
                                                              },
                                                            ],
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "total_quantity",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "available_payment_methods",
                                                    },
                                                    "selectionSet": Object {
                                                      "kind": "SelectionSet",
                                                      "selections": Array [
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "code",
                                                          },
                                                          "selectionSet": undefined,
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                              "typeCondition": Object {
                                                "kind": "NamedType",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "Cart",
                                                },
                                              },
                                            },
                                          ],
                                          "kind": "Document",
                                          "loc": Object {
                                            "end": 932,
                                            "start": 0,
                                          },
                                        },
                                        "variables": Object {
                                          "destinationCartId": "new-cart-id",
                                          "sourceCartId": "old-cart-id",
                                        },
                                      },
                                      "result": Object {
                                        "data": null,
                                      },
                                    },
                                  ],
                                  "{\\"query\\":\\"mutation SignIn($email: String!, $password: String!) {\\\\n  generateCustomerToken(email: $email, password: $password) {\\\\n    token\\\\n    customer_token_lifetime\\\\n  }\\\\n}\\\\n\\"}": Array [
                                    Object {
                                      "request": Object {
                                        "query": Object {
                                          "definitions": Array [
                                            Object {
                                              "directives": Array [],
                                              "kind": "OperationDefinition",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "SignIn",
                                              },
                                              "operation": "mutation",
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [
                                                      Object {
                                                        "kind": "Argument",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "email",
                                                        },
                                                        "value": Object {
                                                          "kind": "Variable",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "email",
                                                          },
                                                        },
                                                      },
                                                      Object {
                                                        "kind": "Argument",
                                                        "name": Object {
                                                          "kind": "Name",
                                                          "value": "password",
                                                        },
                                                        "value": Object {
                                                          "kind": "Variable",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "password",
                                                          },
                                                        },
                                                      },
                                                    ],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "generateCustomerToken",
                                                    },
                                                    "selectionSet": Object {
                                                      "kind": "SelectionSet",
                                                      "selections": Array [
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "token",
                                                          },
                                                          "selectionSet": undefined,
                                                        },
                                                        Object {
                                                          "alias": undefined,
                                                          "arguments": Array [],
                                                          "directives": Array [],
                                                          "kind": "Field",
                                                          "name": Object {
                                                            "kind": "Name",
                                                            "value": "customer_token_lifetime",
                                                          },
                                                          "selectionSet": undefined,
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                              "variableDefinitions": Array [
                                                Object {
                                                  "defaultValue": undefined,
                                                  "directives": Array [],
                                                  "kind": "VariableDefinition",
                                                  "type": Object {
                                                    "kind": "NonNullType",
                                                    "type": Object {
                                                      "kind": "NamedType",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "String",
                                                      },
                                                    },
                                                  },
                                                  "variable": Object {
                                                    "kind": "Variable",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "email",
                                                    },
                                                  },
                                                },
                                                Object {
                                                  "defaultValue": undefined,
                                                  "directives": Array [],
                                                  "kind": "VariableDefinition",
                                                  "type": Object {
                                                    "kind": "NonNullType",
                                                    "type": Object {
                                                      "kind": "NamedType",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "String",
                                                      },
                                                    },
                                                  },
                                                  "variable": Object {
                                                    "kind": "Variable",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "password",
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          ],
                                          "kind": "Document",
                                          "loc": Object {
                                            "end": 198,
                                            "start": 0,
                                          },
                                        },
                                        "variables": Object {
                                          "email": "fry@planetexpress.com",
                                          "password": "slurm is the best",
                                        },
                                      },
                                      "result": Object {
                                        "data": Object {
                                          "generateCustomerToken": Object {
                                            "customer_token_lifetime": 3600,
                                            "token": "auth-token-123",
                                          },
                                        },
                                      },
                                    },
                                  ],
                                },
                                "operation": Object {
                                  "extensions": Object {},
                                  "operationName": "GetReCaptchaV3Config",
                                  "query": Object {
                                    "definitions": Array [
                                      Object {
                                        "directives": Array [],
                                        "kind": "OperationDefinition",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "GetReCaptchaV3Config",
                                        },
                                        "operation": "query",
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "recaptchaV3Config",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "website_key",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "badge_position",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "language_code",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "forms",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                        "variableDefinitions": Array [],
                                      },
                                    ],
                                    "kind": "Document",
                                    "loc": Object {
                                      "end": 173,
                                      "start": 0,
                                    },
                                  },
                                  "variables": Object {},
                                },
                              },
                              "localState": [Circular],
                              "mutationIdCounter": 1,
                              "mutationStore": Object {},
                              "onBroadcast": [Function],
                              "queries": Map {
                                "1" => [Circular],
                              },
                              "queryDeduplication": true,
                              "queryIdCounter": 2,
                              "requestIdCounter": 2,
                              "ssrMode": false,
                              "transformCache": WeakMap {},
                            },
                            "queryName": "GetReCaptchaV3Config",
                            "subscriptions": Set {},
                          },
                          "oqListener": [Function],
                          "queryId": "1",
                          "stopped": false,
                          "subscriptions": Set {},
                          "variables": Object {},
                        },
                      },
                    },
                  },
                  "client": [Circular],
                },
                "mutate": [Function],
                "query": [Function],
                "queryDeduplication": true,
                "queryManager": QueryManager {
                  "assumeImmutableResults": false,
                  "cache": InMemoryCache {
                    "addTypename": false,
                    "config": Object {
                      "addTypename": false,
                      "canonizeResults": false,
                      "dataIdFromObject": [Function],
                      "resultCaching": true,
                    },
                    "data": Root {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "parent": null,
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "rootIds": Object {},
                      "storageTrie": Trie {
                        "makeData": [Function],
                        "weakness": true,
                      },
                      "stump": Stump {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                          "parent": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "parent": null,
                          },
                        },
                        "id": "EntityStore.Stump",
                        "parent": [Circular],
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "replay": [Function],
                        "rootIds": Object {},
                        "toReference": [Function],
                      },
                      "toReference": [Function],
                    },
                    "evict": [Function],
                    "getFragmentDoc": [Function],
                    "makeVar": [Function],
                    "maybeBroadcastWatch": [Function],
                    "modify": [Function],
                    "optimisticData": Stump {
                      "canRead": [Function],
                      "data": Object {},
                      "getFieldValue": [Function],
                      "group": CacheGroup {
                        "caching": true,
                        "d": [Function],
                        "keyMaker": Trie {
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                        "parent": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                      },
                      "id": "EntityStore.Stump",
                      "parent": Root {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "rootIds": Object {},
                        "storageTrie": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "stump": [Circular],
                        "toReference": [Function],
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "refs": Object {},
                      "replay": [Function],
                      "rootIds": Object {},
                      "toReference": [Function],
                    },
                    "policies": Policies {
                      "cache": [Circular],
                      "config": Object {
                        "cache": [Circular],
                        "dataIdFromObject": [Function],
                        "possibleTypes": undefined,
                        "typePolicies": undefined,
                      },
                      "fuzzySubtypes": Map {},
                      "rootIdsByTypename": Object {
                        "Mutation": "ROOT_MUTATION",
                        "Query": "ROOT_QUERY",
                        "Subscription": "ROOT_SUBSCRIPTION",
                      },
                      "rootTypenamesById": Object {
                        "ROOT_MUTATION": "Mutation",
                        "ROOT_QUERY": "Query",
                        "ROOT_SUBSCRIPTION": "Subscription",
                      },
                      "supertypeMap": Map {},
                      "toBeAdded": Object {},
                      "typePolicies": Object {
                        "Query": Object {
                          "fields": Object {},
                        },
                      },
                      "usingPossibleTypes": false,
                    },
                    "reset": [Function],
                    "storeReader": StoreReader {
                      "canon": ObjectCanon {
                        "empty": Object {},
                        "keysByJSON": Map {
                          "[]" => Object {
                            "json": "[]",
                            "sorted": Array [],
                          },
                        },
                        "known": WeakSet {},
                        "passes": WeakMap {},
                        "pool": Trie {
                          "data": Object {
                            "keys": Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "makeData": [Function],
                          "weak": WeakMap {},
                          "weakness": true,
                        },
                      },
                      "config": Object {
                        "addTypename": false,
                        "cache": [Circular],
                        "canonizeResults": false,
                      },
                      "executeSelectionSet": [Function],
                      "executeSubSelectedArray": [Function],
                      "knownResults": WeakMap {},
                    },
                    "storeWriter": StoreWriter {
                      "cache": [Circular],
                      "reader": StoreReader {
                        "canon": ObjectCanon {
                          "empty": Object {},
                          "keysByJSON": Map {
                            "[]" => Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "known": WeakSet {},
                          "passes": WeakMap {},
                          "pool": Trie {
                            "data": Object {
                              "keys": Object {
                                "json": "[]",
                                "sorted": Array [],
                              },
                            },
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                        },
                        "config": Object {
                          "addTypename": false,
                          "cache": [Circular],
                          "canonizeResults": false,
                        },
                        "executeSelectionSet": [Function],
                        "executeSubSelectedArray": [Function],
                        "knownResults": WeakMap {},
                      },
                    },
                    "txCount": 0,
                    "typenameDocumentCache": Map {},
                    "watches": Set {
                      Object {
                        "callback": [Function],
                        "canonizeResults": undefined,
                        "optimistic": true,
                        "query": Object {
                          "definitions": Array [
                            Object {
                              "directives": Array [],
                              "kind": "OperationDefinition",
                              "name": Object {
                                "kind": "Name",
                                "value": "GetReCaptchaV3Config",
                              },
                              "operation": "query",
                              "selectionSet": Object {
                                "kind": "SelectionSet",
                                "selections": Array [
                                  Object {
                                    "alias": undefined,
                                    "arguments": Array [],
                                    "directives": Array [],
                                    "kind": "Field",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "recaptchaV3Config",
                                    },
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "website_key",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "badge_position",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "language_code",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "forms",
                                          },
                                          "selectionSet": undefined,
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              "variableDefinitions": Array [],
                            },
                          ],
                          "kind": "Document",
                          "loc": Object {
                            "end": 173,
                            "start": 0,
                          },
                        },
                        "returnPartialData": true,
                        "variables": Object {},
                        "watcher": QueryInfo {
                          "cache": [Circular],
                          "cancel": [Function],
                          "dirty": false,
                          "document": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "GetReCaptchaV3Config",
                                },
                                "operation": "query",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "recaptchaV3Config",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "website_key",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "badge_position",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "language_code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "forms",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 173,
                              "start": 0,
                            },
                          },
                          "graphQLErrors": Array [],
                          "lastDiff": Object {
                            "diff": Object {
                              "complete": false,
                              "missing": Array [
                                MissingFieldError {
                                  "message": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                  "path": Object {
                                    "recaptchaV3Config": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                  },
                                  "query": Object {
                                    "definitions": Array [
                                      Object {
                                        "directives": Array [],
                                        "kind": "OperationDefinition",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "GetReCaptchaV3Config",
                                        },
                                        "operation": "query",
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "recaptchaV3Config",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "website_key",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "badge_position",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "language_code",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "forms",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                        "variableDefinitions": Array [],
                                      },
                                    ],
                                    "kind": "Document",
                                    "loc": Object {
                                      "end": 173,
                                      "start": 0,
                                    },
                                  },
                                  "variables": Object {},
                                },
                              ],
                              "result": Object {},
                            },
                            "options": Object {
                              "canonizeResults": undefined,
                              "optimistic": true,
                              "query": Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              },
                              "returnPartialData": true,
                              "variables": Object {},
                            },
                          },
                          "lastRequestId": 1,
                          "lastWatch": [Circular],
                          "listeners": Set {
                            [Function],
                          },
                          "networkError": null,
                          "networkStatus": 1,
                          "observableQuery": ObservableQuery {
                            "_subscriber": [Function],
                            "concast": Concast {
                              "_subscriber": [Function],
                              "addCount": 1,
                              "cancel": [Function],
                              "handlers": Object {
                                "complete": [Function],
                                "error": [Function],
                                "next": [Function],
                              },
                              "observers": Set {
                                Object {
                                  "complete": [Function],
                                  "error": [Function],
                                  "next": [Function],
                                },
                                Object {
                                  "error": [Function],
                                  "next": [Function],
                                },
                              },
                              "promise": Promise {},
                              "reject": [Function],
                              "resolve": [Function],
                              "sources": Array [],
                              "sub": Subscription {
                                "_cleanup": [Function],
                                "_observer": Object {
                                  "complete": [Function],
                                  "error": [Function],
                                  "next": [Function],
                                },
                                "_queue": undefined,
                                "_state": "ready",
                              },
                            },
                            "initialFetchPolicy": "cache-and-network",
                            "isTornDown": false,
                            "last": Object {
                              "result": Object {
                                "loading": true,
                                "networkStatus": 1,
                                "partial": true,
                              },
                              "variables": Object {},
                            },
                            "observer": Object {
                              "error": [Function],
                              "next": [Function],
                            },
                            "observers": Set {
                              SubscriptionObserver {
                                "_subscription": Subscription {
                                  "_cleanup": [Function],
                                  "_observer": Object {
                                    "complete": undefined,
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                  "_queue": Array [
                                    Object {
                                      "type": "next",
                                      "value": Object {
                                        "loading": true,
                                        "networkStatus": 1,
                                        "partial": true,
                                      },
                                    },
                                  ],
                                  "_state": "buffering",
                                },
                              },
                            },
                            "options": Object {
                              "fetchPolicy": "cache-and-network",
                              "notifyOnNetworkStatusChange": false,
                              "query": Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              },
                              "variables": Object {},
                            },
                            "queryId": "1",
                            "queryInfo": [Circular],
                            "queryManager": [Circular],
                            "queryName": "GetReCaptchaV3Config",
                            "subscriptions": Set {},
                          },
                          "oqListener": [Function],
                          "queryId": "1",
                          "stopped": false,
                          "subscriptions": Set {},
                          "variables": Object {},
                        },
                      },
                    },
                  },
                  "clientAwareness": Object {
                    "name": undefined,
                    "version": undefined,
                  },
                  "fetchCancelFns": Map {
                    "1" => [Function],
                  },
                  "inFlightLinkObservables": Map {
                    Object {
                      "definitions": Array [
                        Object {
                          "directives": Array [],
                          "kind": "OperationDefinition",
                          "name": Object {
                            "kind": "Name",
                            "value": "GetReCaptchaV3Config",
                          },
                          "operation": "query",
                          "selectionSet": Object {
                            "kind": "SelectionSet",
                            "selections": Array [
                              Object {
                                "alias": undefined,
                                "arguments": Array [],
                                "directives": Array [],
                                "kind": "Field",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "recaptchaV3Config",
                                },
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "website_key",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "badge_position",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "language_code",
                                      },
                                      "selectionSet": undefined,
                                    },
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "forms",
                                      },
                                      "selectionSet": undefined,
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          "variableDefinitions": Array [],
                        },
                      ],
                      "kind": "Document",
                      "loc": Object {
                        "end": 173,
                        "start": 0,
                      },
                    } => Map {
                      "{}" => Concast {
                        "_subscriber": [Function],
                        "addCount": 1,
                        "cancel": [Function],
                        "handlers": Object {
                          "complete": [Function],
                          "error": [Function],
                          "next": [Function],
                        },
                        "observers": Set {
                          Object {
                            "complete": [Function],
                            "error": [Function],
                            "next": [Function],
                          },
                          SubscriptionObserver {
                            "_subscription": Subscription {
                              "_cleanup": [Function],
                              "_observer": Object {
                                "complete": [Function],
                                "error": [Function],
                                "next": [Function],
                              },
                              "_queue": undefined,
                              "_state": "ready",
                            },
                          },
                        },
                        "promise": Promise {},
                        "reject": [Function],
                        "resolve": [Function],
                        "sources": Array [],
                        "sub": Subscription {
                          "_cleanup": [Function],
                          "_observer": Object {
                            "complete": [Function],
                            "error": [Function],
                            "next": [Function],
                          },
                          "_queue": undefined,
                          "_state": "ready",
                        },
                      },
                    },
                  },
                  "link": MockLink {
                    "addTypename": false,
                    "mockedResponsesByKey": Object {
                      "{\\"query\\":\\"mutation MergeCartsAfterSignIn($sourceCartId: String!, $destinationCartId: String!) {\\\\n  mergeCarts(\\\\n    source_cart_id: $sourceCartId\\\\n    destination_cart_id: $destinationCartId\\\\n  ) {\\\\n    id\\\\n    items {\\\\n      uid\\\\n    }\\\\n    ...CheckoutPageFragment\\\\n  }\\\\n}\\\\n\\\\nfragment CheckoutPageFragment on Cart {\\\\n  id\\\\n  items {\\\\n    uid\\\\n    product {\\\\n      uid\\\\n      stock_status\\\\n    }\\\\n  }\\\\n  total_quantity\\\\n  available_payment_methods {\\\\n    code\\\\n  }\\\\n}\\\\n\\"}": Array [
                        Object {
                          "request": Object {
                            "query": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "MergeCartsAfterSignIn",
                                  },
                                  "operation": "mutation",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [
                                          Object {
                                            "kind": "Argument",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "source_cart_id",
                                            },
                                            "value": Object {
                                              "kind": "Variable",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "sourceCartId",
                                              },
                                            },
                                          },
                                          Object {
                                            "kind": "Argument",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "destination_cart_id",
                                            },
                                            "value": Object {
                                              "kind": "Variable",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "destinationCartId",
                                              },
                                            },
                                          },
                                        ],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "mergeCarts",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "id",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "items",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "uid",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                ],
                                              },
                                            },
                                            Object {
                                              "directives": Array [],
                                              "kind": "FragmentSpread",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "CheckoutPageFragment",
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [
                                    Object {
                                      "defaultValue": undefined,
                                      "directives": Array [],
                                      "kind": "VariableDefinition",
                                      "type": Object {
                                        "kind": "NonNullType",
                                        "type": Object {
                                          "kind": "NamedType",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "String",
                                          },
                                        },
                                      },
                                      "variable": Object {
                                        "kind": "Variable",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "sourceCartId",
                                        },
                                      },
                                    },
                                    Object {
                                      "defaultValue": undefined,
                                      "directives": Array [],
                                      "kind": "VariableDefinition",
                                      "type": Object {
                                        "kind": "NonNullType",
                                        "type": Object {
                                          "kind": "NamedType",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "String",
                                          },
                                        },
                                      },
                                      "variable": Object {
                                        "kind": "Variable",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "destinationCartId",
                                        },
                                      },
                                    },
                                  ],
                                },
                                Object {
                                  "directives": Array [],
                                  "kind": "FragmentDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "CheckoutPageFragment",
                                  },
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "id",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "items",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "uid",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "product",
                                              },
                                              "selectionSet": Object {
                                                "kind": "SelectionSet",
                                                "selections": Array [
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "uid",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                  Object {
                                                    "alias": undefined,
                                                    "arguments": Array [],
                                                    "directives": Array [],
                                                    "kind": "Field",
                                                    "name": Object {
                                                      "kind": "Name",
                                                      "value": "stock_status",
                                                    },
                                                    "selectionSet": undefined,
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "total_quantity",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "available_payment_methods",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "code",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "typeCondition": Object {
                                    "kind": "NamedType",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "Cart",
                                    },
                                  },
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 932,
                                "start": 0,
                              },
                            },
                            "variables": Object {
                              "destinationCartId": "new-cart-id",
                              "sourceCartId": "old-cart-id",
                            },
                          },
                          "result": Object {
                            "data": null,
                          },
                        },
                      ],
                      "{\\"query\\":\\"mutation SignIn($email: String!, $password: String!) {\\\\n  generateCustomerToken(email: $email, password: $password) {\\\\n    token\\\\n    customer_token_lifetime\\\\n  }\\\\n}\\\\n\\"}": Array [
                        Object {
                          "request": Object {
                            "query": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "SignIn",
                                  },
                                  "operation": "mutation",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [
                                          Object {
                                            "kind": "Argument",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "email",
                                            },
                                            "value": Object {
                                              "kind": "Variable",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "email",
                                              },
                                            },
                                          },
                                          Object {
                                            "kind": "Argument",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "password",
                                            },
                                            "value": Object {
                                              "kind": "Variable",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "password",
                                              },
                                            },
                                          },
                                        ],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "generateCustomerToken",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "token",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "customer_token_lifetime",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [
                                    Object {
                                      "defaultValue": undefined,
                                      "directives": Array [],
                                      "kind": "VariableDefinition",
                                      "type": Object {
                                        "kind": "NonNullType",
                                        "type": Object {
                                          "kind": "NamedType",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "String",
                                          },
                                        },
                                      },
                                      "variable": Object {
                                        "kind": "Variable",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "email",
                                        },
                                      },
                                    },
                                    Object {
                                      "defaultValue": undefined,
                                      "directives": Array [],
                                      "kind": "VariableDefinition",
                                      "type": Object {
                                        "kind": "NonNullType",
                                        "type": Object {
                                          "kind": "NamedType",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "String",
                                          },
                                        },
                                      },
                                      "variable": Object {
                                        "kind": "Variable",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "password",
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 198,
                                "start": 0,
                              },
                            },
                            "variables": Object {
                              "email": "fry@planetexpress.com",
                              "password": "slurm is the best",
                            },
                          },
                          "result": Object {
                            "data": Object {
                              "generateCustomerToken": Object {
                                "customer_token_lifetime": 3600,
                                "token": "auth-token-123",
                              },
                            },
                          },
                        },
                      ],
                    },
                    "operation": Object {
                      "extensions": Object {},
                      "operationName": "GetReCaptchaV3Config",
                      "query": Object {
                        "definitions": Array [
                          Object {
                            "directives": Array [],
                            "kind": "OperationDefinition",
                            "name": Object {
                              "kind": "Name",
                              "value": "GetReCaptchaV3Config",
                            },
                            "operation": "query",
                            "selectionSet": Object {
                              "kind": "SelectionSet",
                              "selections": Array [
                                Object {
                                  "alias": undefined,
                                  "arguments": Array [],
                                  "directives": Array [],
                                  "kind": "Field",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "recaptchaV3Config",
                                  },
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "website_key",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "badge_position",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "language_code",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "forms",
                                        },
                                        "selectionSet": undefined,
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                            "variableDefinitions": Array [],
                          },
                        ],
                        "kind": "Document",
                        "loc": Object {
                          "end": 173,
                          "start": 0,
                        },
                      },
                      "variables": Object {},
                    },
                  },
                  "localState": LocalState {
                    "cache": InMemoryCache {
                      "addTypename": false,
                      "config": Object {
                        "addTypename": false,
                        "canonizeResults": false,
                        "dataIdFromObject": [Function],
                        "resultCaching": true,
                      },
                      "data": Root {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "parent": null,
                        },
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "rootIds": Object {},
                        "storageTrie": Trie {
                          "makeData": [Function],
                          "weakness": true,
                        },
                        "stump": Stump {
                          "canRead": [Function],
                          "data": Object {},
                          "getFieldValue": [Function],
                          "group": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weak": WeakMap {},
                              "weakness": true,
                            },
                            "parent": CacheGroup {
                              "caching": true,
                              "d": [Function],
                              "keyMaker": Trie {
                                "makeData": [Function],
                                "weakness": true,
                              },
                              "parent": null,
                            },
                          },
                          "id": "EntityStore.Stump",
                          "parent": [Circular],
                          "policies": Policies {
                            "cache": [Circular],
                            "config": Object {
                              "cache": [Circular],
                              "dataIdFromObject": [Function],
                              "possibleTypes": undefined,
                              "typePolicies": undefined,
                            },
                            "fuzzySubtypes": Map {},
                            "rootIdsByTypename": Object {
                              "Mutation": "ROOT_MUTATION",
                              "Query": "ROOT_QUERY",
                              "Subscription": "ROOT_SUBSCRIPTION",
                            },
                            "rootTypenamesById": Object {
                              "ROOT_MUTATION": "Mutation",
                              "ROOT_QUERY": "Query",
                              "ROOT_SUBSCRIPTION": "Subscription",
                            },
                            "supertypeMap": Map {},
                            "toBeAdded": Object {},
                            "typePolicies": Object {
                              "Query": Object {
                                "fields": Object {},
                              },
                            },
                            "usingPossibleTypes": false,
                          },
                          "refs": Object {},
                          "replay": [Function],
                          "rootIds": Object {},
                          "toReference": [Function],
                        },
                        "toReference": [Function],
                      },
                      "evict": [Function],
                      "getFragmentDoc": [Function],
                      "makeVar": [Function],
                      "maybeBroadcastWatch": [Function],
                      "modify": [Function],
                      "optimisticData": Stump {
                        "canRead": [Function],
                        "data": Object {},
                        "getFieldValue": [Function],
                        "group": CacheGroup {
                          "caching": true,
                          "d": [Function],
                          "keyMaker": Trie {
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                          "parent": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "parent": null,
                          },
                        },
                        "id": "EntityStore.Stump",
                        "parent": Root {
                          "canRead": [Function],
                          "data": Object {},
                          "getFieldValue": [Function],
                          "group": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "parent": null,
                          },
                          "policies": Policies {
                            "cache": [Circular],
                            "config": Object {
                              "cache": [Circular],
                              "dataIdFromObject": [Function],
                              "possibleTypes": undefined,
                              "typePolicies": undefined,
                            },
                            "fuzzySubtypes": Map {},
                            "rootIdsByTypename": Object {
                              "Mutation": "ROOT_MUTATION",
                              "Query": "ROOT_QUERY",
                              "Subscription": "ROOT_SUBSCRIPTION",
                            },
                            "rootTypenamesById": Object {
                              "ROOT_MUTATION": "Mutation",
                              "ROOT_QUERY": "Query",
                              "ROOT_SUBSCRIPTION": "Subscription",
                            },
                            "supertypeMap": Map {},
                            "toBeAdded": Object {},
                            "typePolicies": Object {
                              "Query": Object {
                                "fields": Object {},
                              },
                            },
                            "usingPossibleTypes": false,
                          },
                          "refs": Object {},
                          "rootIds": Object {},
                          "storageTrie": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "stump": [Circular],
                          "toReference": [Function],
                        },
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "refs": Object {},
                        "replay": [Function],
                        "rootIds": Object {},
                        "toReference": [Function],
                      },
                      "policies": Policies {
                        "cache": [Circular],
                        "config": Object {
                          "cache": [Circular],
                          "dataIdFromObject": [Function],
                          "possibleTypes": undefined,
                          "typePolicies": undefined,
                        },
                        "fuzzySubtypes": Map {},
                        "rootIdsByTypename": Object {
                          "Mutation": "ROOT_MUTATION",
                          "Query": "ROOT_QUERY",
                          "Subscription": "ROOT_SUBSCRIPTION",
                        },
                        "rootTypenamesById": Object {
                          "ROOT_MUTATION": "Mutation",
                          "ROOT_QUERY": "Query",
                          "ROOT_SUBSCRIPTION": "Subscription",
                        },
                        "supertypeMap": Map {},
                        "toBeAdded": Object {},
                        "typePolicies": Object {
                          "Query": Object {
                            "fields": Object {},
                          },
                        },
                        "usingPossibleTypes": false,
                      },
                      "reset": [Function],
                      "storeReader": StoreReader {
                        "canon": ObjectCanon {
                          "empty": Object {},
                          "keysByJSON": Map {
                            "[]" => Object {
                              "json": "[]",
                              "sorted": Array [],
                            },
                          },
                          "known": WeakSet {},
                          "passes": WeakMap {},
                          "pool": Trie {
                            "data": Object {
                              "keys": Object {
                                "json": "[]",
                                "sorted": Array [],
                              },
                            },
                            "makeData": [Function],
                            "weak": WeakMap {},
                            "weakness": true,
                          },
                        },
                        "config": Object {
                          "addTypename": false,
                          "cache": [Circular],
                          "canonizeResults": false,
                        },
                        "executeSelectionSet": [Function],
                        "executeSubSelectedArray": [Function],
                        "knownResults": WeakMap {},
                      },
                      "storeWriter": StoreWriter {
                        "cache": [Circular],
                        "reader": StoreReader {
                          "canon": ObjectCanon {
                            "empty": Object {},
                            "keysByJSON": Map {
                              "[]" => Object {
                                "json": "[]",
                                "sorted": Array [],
                              },
                            },
                            "known": WeakSet {},
                            "passes": WeakMap {},
                            "pool": Trie {
                              "data": Object {
                                "keys": Object {
                                  "json": "[]",
                                  "sorted": Array [],
                                },
                              },
                              "makeData": [Function],
                              "weak": WeakMap {},
                              "weakness": true,
                            },
                          },
                          "config": Object {
                            "addTypename": false,
                            "cache": [Circular],
                            "canonizeResults": false,
                          },
                          "executeSelectionSet": [Function],
                          "executeSubSelectedArray": [Function],
                          "knownResults": WeakMap {},
                        },
                      },
                      "txCount": 0,
                      "typenameDocumentCache": Map {},
                      "watches": Set {
                        Object {
                          "callback": [Function],
                          "canonizeResults": undefined,
                          "optimistic": true,
                          "query": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "GetReCaptchaV3Config",
                                },
                                "operation": "query",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "recaptchaV3Config",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "website_key",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "badge_position",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "language_code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "forms",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 173,
                              "start": 0,
                            },
                          },
                          "returnPartialData": true,
                          "variables": Object {},
                          "watcher": QueryInfo {
                            "cache": [Circular],
                            "cancel": [Function],
                            "dirty": false,
                            "document": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "GetReCaptchaV3Config",
                                  },
                                  "operation": "query",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "recaptchaV3Config",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "website_key",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "badge_position",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "language_code",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "forms",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [],
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 173,
                                "start": 0,
                              },
                            },
                            "graphQLErrors": Array [],
                            "lastDiff": Object {
                              "diff": Object {
                                "complete": false,
                                "missing": Array [
                                  MissingFieldError {
                                    "message": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                    "path": Object {
                                      "recaptchaV3Config": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                                    },
                                    "query": Object {
                                      "definitions": Array [
                                        Object {
                                          "directives": Array [],
                                          "kind": "OperationDefinition",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "GetReCaptchaV3Config",
                                          },
                                          "operation": "query",
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "recaptchaV3Config",
                                                },
                                                "selectionSet": Object {
                                                  "kind": "SelectionSet",
                                                  "selections": Array [
                                                    Object {
                                                      "alias": undefined,
                                                      "arguments": Array [],
                                                      "directives": Array [],
                                                      "kind": "Field",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "website_key",
                                                      },
                                                      "selectionSet": undefined,
                                                    },
                                                    Object {
                                                      "alias": undefined,
                                                      "arguments": Array [],
                                                      "directives": Array [],
                                                      "kind": "Field",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "badge_position",
                                                      },
                                                      "selectionSet": undefined,
                                                    },
                                                    Object {
                                                      "alias": undefined,
                                                      "arguments": Array [],
                                                      "directives": Array [],
                                                      "kind": "Field",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "language_code",
                                                      },
                                                      "selectionSet": undefined,
                                                    },
                                                    Object {
                                                      "alias": undefined,
                                                      "arguments": Array [],
                                                      "directives": Array [],
                                                      "kind": "Field",
                                                      "name": Object {
                                                        "kind": "Name",
                                                        "value": "forms",
                                                      },
                                                      "selectionSet": undefined,
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                          "variableDefinitions": Array [],
                                        },
                                      ],
                                      "kind": "Document",
                                      "loc": Object {
                                        "end": 173,
                                        "start": 0,
                                      },
                                    },
                                    "variables": Object {},
                                  },
                                ],
                                "result": Object {},
                              },
                              "options": Object {
                                "canonizeResults": undefined,
                                "optimistic": true,
                                "query": Object {
                                  "definitions": Array [
                                    Object {
                                      "directives": Array [],
                                      "kind": "OperationDefinition",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "GetReCaptchaV3Config",
                                      },
                                      "operation": "query",
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "recaptchaV3Config",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "website_key",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "badge_position",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "language_code",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "forms",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                      "variableDefinitions": Array [],
                                    },
                                  ],
                                  "kind": "Document",
                                  "loc": Object {
                                    "end": 173,
                                    "start": 0,
                                  },
                                },
                                "returnPartialData": true,
                                "variables": Object {},
                              },
                            },
                            "lastRequestId": 1,
                            "lastWatch": [Circular],
                            "listeners": Set {
                              [Function],
                            },
                            "networkError": null,
                            "networkStatus": 1,
                            "observableQuery": ObservableQuery {
                              "_subscriber": [Function],
                              "concast": Concast {
                                "_subscriber": [Function],
                                "addCount": 1,
                                "cancel": [Function],
                                "handlers": Object {
                                  "complete": [Function],
                                  "error": [Function],
                                  "next": [Function],
                                },
                                "observers": Set {
                                  Object {
                                    "complete": [Function],
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                  Object {
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                },
                                "promise": Promise {},
                                "reject": [Function],
                                "resolve": [Function],
                                "sources": Array [],
                                "sub": Subscription {
                                  "_cleanup": [Function],
                                  "_observer": Object {
                                    "complete": [Function],
                                    "error": [Function],
                                    "next": [Function],
                                  },
                                  "_queue": undefined,
                                  "_state": "ready",
                                },
                              },
                              "initialFetchPolicy": "cache-and-network",
                              "isTornDown": false,
                              "last": Object {
                                "result": Object {
                                  "loading": true,
                                  "networkStatus": 1,
                                  "partial": true,
                                },
                                "variables": Object {},
                              },
                              "observer": Object {
                                "error": [Function],
                                "next": [Function],
                              },
                              "observers": Set {
                                SubscriptionObserver {
                                  "_subscription": Subscription {
                                    "_cleanup": [Function],
                                    "_observer": Object {
                                      "complete": undefined,
                                      "error": [Function],
                                      "next": [Function],
                                    },
                                    "_queue": Array [
                                      Object {
                                        "type": "next",
                                        "value": Object {
                                          "loading": true,
                                          "networkStatus": 1,
                                          "partial": true,
                                        },
                                      },
                                    ],
                                    "_state": "buffering",
                                  },
                                },
                              },
                              "options": Object {
                                "fetchPolicy": "cache-and-network",
                                "notifyOnNetworkStatusChange": false,
                                "query": Object {
                                  "definitions": Array [
                                    Object {
                                      "directives": Array [],
                                      "kind": "OperationDefinition",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "GetReCaptchaV3Config",
                                      },
                                      "operation": "query",
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "recaptchaV3Config",
                                            },
                                            "selectionSet": Object {
                                              "kind": "SelectionSet",
                                              "selections": Array [
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "website_key",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "badge_position",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "language_code",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                                Object {
                                                  "alias": undefined,
                                                  "arguments": Array [],
                                                  "directives": Array [],
                                                  "kind": "Field",
                                                  "name": Object {
                                                    "kind": "Name",
                                                    "value": "forms",
                                                  },
                                                  "selectionSet": undefined,
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                      "variableDefinitions": Array [],
                                    },
                                  ],
                                  "kind": "Document",
                                  "loc": Object {
                                    "end": 173,
                                    "start": 0,
                                  },
                                },
                                "variables": Object {},
                              },
                              "queryId": "1",
                              "queryInfo": [Circular],
                              "queryManager": [Circular],
                              "queryName": "GetReCaptchaV3Config",
                              "subscriptions": Set {},
                            },
                            "oqListener": [Function],
                            "queryId": "1",
                            "stopped": false,
                            "subscriptions": Set {},
                            "variables": Object {},
                          },
                        },
                      },
                    },
                    "client": [Circular],
                  },
                  "mutationIdCounter": 1,
                  "mutationStore": Object {},
                  "onBroadcast": [Function],
                  "queries": Map {
                    "1" => QueryInfo {
                      "cache": InMemoryCache {
                        "addTypename": false,
                        "config": Object {
                          "addTypename": false,
                          "canonizeResults": false,
                          "dataIdFromObject": [Function],
                          "resultCaching": true,
                        },
                        "data": Root {
                          "canRead": [Function],
                          "data": Object {},
                          "getFieldValue": [Function],
                          "group": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "parent": null,
                          },
                          "policies": Policies {
                            "cache": [Circular],
                            "config": Object {
                              "cache": [Circular],
                              "dataIdFromObject": [Function],
                              "possibleTypes": undefined,
                              "typePolicies": undefined,
                            },
                            "fuzzySubtypes": Map {},
                            "rootIdsByTypename": Object {
                              "Mutation": "ROOT_MUTATION",
                              "Query": "ROOT_QUERY",
                              "Subscription": "ROOT_SUBSCRIPTION",
                            },
                            "rootTypenamesById": Object {
                              "ROOT_MUTATION": "Mutation",
                              "ROOT_QUERY": "Query",
                              "ROOT_SUBSCRIPTION": "Subscription",
                            },
                            "supertypeMap": Map {},
                            "toBeAdded": Object {},
                            "typePolicies": Object {
                              "Query": Object {
                                "fields": Object {},
                              },
                            },
                            "usingPossibleTypes": false,
                          },
                          "refs": Object {},
                          "rootIds": Object {},
                          "storageTrie": Trie {
                            "makeData": [Function],
                            "weakness": true,
                          },
                          "stump": Stump {
                            "canRead": [Function],
                            "data": Object {},
                            "getFieldValue": [Function],
                            "group": CacheGroup {
                              "caching": true,
                              "d": [Function],
                              "keyMaker": Trie {
                                "makeData": [Function],
                                "weak": WeakMap {},
                                "weakness": true,
                              },
                              "parent": CacheGroup {
                                "caching": true,
                                "d": [Function],
                                "keyMaker": Trie {
                                  "makeData": [Function],
                                  "weakness": true,
                                },
                                "parent": null,
                              },
                            },
                            "id": "EntityStore.Stump",
                            "parent": [Circular],
                            "policies": Policies {
                              "cache": [Circular],
                              "config": Object {
                                "cache": [Circular],
                                "dataIdFromObject": [Function],
                                "possibleTypes": undefined,
                                "typePolicies": undefined,
                              },
                              "fuzzySubtypes": Map {},
                              "rootIdsByTypename": Object {
                                "Mutation": "ROOT_MUTATION",
                                "Query": "ROOT_QUERY",
                                "Subscription": "ROOT_SUBSCRIPTION",
                              },
                              "rootTypenamesById": Object {
                                "ROOT_MUTATION": "Mutation",
                                "ROOT_QUERY": "Query",
                                "ROOT_SUBSCRIPTION": "Subscription",
                              },
                              "supertypeMap": Map {},
                              "toBeAdded": Object {},
                              "typePolicies": Object {
                                "Query": Object {
                                  "fields": Object {},
                                },
                              },
                              "usingPossibleTypes": false,
                            },
                            "refs": Object {},
                            "replay": [Function],
                            "rootIds": Object {},
                            "toReference": [Function],
                          },
                          "toReference": [Function],
                        },
                        "evict": [Function],
                        "getFragmentDoc": [Function],
                        "makeVar": [Function],
                        "maybeBroadcastWatch": [Function],
                        "modify": [Function],
                        "optimisticData": Stump {
                          "canRead": [Function],
                          "data": Object {},
                          "getFieldValue": [Function],
                          "group": CacheGroup {
                            "caching": true,
                            "d": [Function],
                            "keyMaker": Trie {
                              "makeData": [Function],
                              "weak": WeakMap {},
                              "weakness": true,
                            },
                            "parent": CacheGroup {
                              "caching": true,
                              "d": [Function],
                              "keyMaker": Trie {
                                "makeData": [Function],
                                "weakness": true,
                              },
                              "parent": null,
                            },
                          },
                          "id": "EntityStore.Stump",
                          "parent": Root {
                            "canRead": [Function],
                            "data": Object {},
                            "getFieldValue": [Function],
                            "group": CacheGroup {
                              "caching": true,
                              "d": [Function],
                              "keyMaker": Trie {
                                "makeData": [Function],
                                "weakness": true,
                              },
                              "parent": null,
                            },
                            "policies": Policies {
                              "cache": [Circular],
                              "config": Object {
                                "cache": [Circular],
                                "dataIdFromObject": [Function],
                                "possibleTypes": undefined,
                                "typePolicies": undefined,
                              },
                              "fuzzySubtypes": Map {},
                              "rootIdsByTypename": Object {
                                "Mutation": "ROOT_MUTATION",
                                "Query": "ROOT_QUERY",
                                "Subscription": "ROOT_SUBSCRIPTION",
                              },
                              "rootTypenamesById": Object {
                                "ROOT_MUTATION": "Mutation",
                                "ROOT_QUERY": "Query",
                                "ROOT_SUBSCRIPTION": "Subscription",
                              },
                              "supertypeMap": Map {},
                              "toBeAdded": Object {},
                              "typePolicies": Object {
                                "Query": Object {
                                  "fields": Object {},
                                },
                              },
                              "usingPossibleTypes": false,
                            },
                            "refs": Object {},
                            "rootIds": Object {},
                            "storageTrie": Trie {
                              "makeData": [Function],
                              "weakness": true,
                            },
                            "stump": [Circular],
                            "toReference": [Function],
                          },
                          "policies": Policies {
                            "cache": [Circular],
                            "config": Object {
                              "cache": [Circular],
                              "dataIdFromObject": [Function],
                              "possibleTypes": undefined,
                              "typePolicies": undefined,
                            },
                            "fuzzySubtypes": Map {},
                            "rootIdsByTypename": Object {
                              "Mutation": "ROOT_MUTATION",
                              "Query": "ROOT_QUERY",
                              "Subscription": "ROOT_SUBSCRIPTION",
                            },
                            "rootTypenamesById": Object {
                              "ROOT_MUTATION": "Mutation",
                              "ROOT_QUERY": "Query",
                              "ROOT_SUBSCRIPTION": "Subscription",
                            },
                            "supertypeMap": Map {},
                            "toBeAdded": Object {},
                            "typePolicies": Object {
                              "Query": Object {
                                "fields": Object {},
                              },
                            },
                            "usingPossibleTypes": false,
                          },
                          "refs": Object {},
                          "replay": [Function],
                          "rootIds": Object {},
                          "toReference": [Function],
                        },
                        "policies": Policies {
                          "cache": [Circular],
                          "config": Object {
                            "cache": [Circular],
                            "dataIdFromObject": [Function],
                            "possibleTypes": undefined,
                            "typePolicies": undefined,
                          },
                          "fuzzySubtypes": Map {},
                          "rootIdsByTypename": Object {
                            "Mutation": "ROOT_MUTATION",
                            "Query": "ROOT_QUERY",
                            "Subscription": "ROOT_SUBSCRIPTION",
                          },
                          "rootTypenamesById": Object {
                            "ROOT_MUTATION": "Mutation",
                            "ROOT_QUERY": "Query",
                            "ROOT_SUBSCRIPTION": "Subscription",
                          },
                          "supertypeMap": Map {},
                          "toBeAdded": Object {},
                          "typePolicies": Object {
                            "Query": Object {
                              "fields": Object {},
                            },
                          },
                          "usingPossibleTypes": false,
                        },
                        "reset": [Function],
                        "storeReader": StoreReader {
                          "canon": ObjectCanon {
                            "empty": Object {},
                            "keysByJSON": Map {
                              "[]" => Object {
                                "json": "[]",
                                "sorted": Array [],
                              },
                            },
                            "known": WeakSet {},
                            "passes": WeakMap {},
                            "pool": Trie {
                              "data": Object {
                                "keys": Object {
                                  "json": "[]",
                                  "sorted": Array [],
                                },
                              },
                              "makeData": [Function],
                              "weak": WeakMap {},
                              "weakness": true,
                            },
                          },
                          "config": Object {
                            "addTypename": false,
                            "cache": [Circular],
                            "canonizeResults": false,
                          },
                          "executeSelectionSet": [Function],
                          "executeSubSelectedArray": [Function],
                          "knownResults": WeakMap {},
                        },
                        "storeWriter": StoreWriter {
                          "cache": [Circular],
                          "reader": StoreReader {
                            "canon": ObjectCanon {
                              "empty": Object {},
                              "keysByJSON": Map {
                                "[]" => Object {
                                  "json": "[]",
                                  "sorted": Array [],
                                },
                              },
                              "known": WeakSet {},
                              "passes": WeakMap {},
                              "pool": Trie {
                                "data": Object {
                                  "keys": Object {
                                    "json": "[]",
                                    "sorted": Array [],
                                  },
                                },
                                "makeData": [Function],
                                "weak": WeakMap {},
                                "weakness": true,
                              },
                            },
                            "config": Object {
                              "addTypename": false,
                              "cache": [Circular],
                              "canonizeResults": false,
                            },
                            "executeSelectionSet": [Function],
                            "executeSubSelectedArray": [Function],
                            "knownResults": WeakMap {},
                          },
                        },
                        "txCount": 0,
                        "typenameDocumentCache": Map {},
                        "watches": Set {
                          Object {
                            "callback": [Function],
                            "canonizeResults": undefined,
                            "optimistic": true,
                            "query": Object {
                              "definitions": Array [
                                Object {
                                  "directives": Array [],
                                  "kind": "OperationDefinition",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "GetReCaptchaV3Config",
                                  },
                                  "operation": "query",
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "recaptchaV3Config",
                                        },
                                        "selectionSet": Object {
                                          "kind": "SelectionSet",
                                          "selections": Array [
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "website_key",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "badge_position",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "language_code",
                                              },
                                              "selectionSet": undefined,
                                            },
                                            Object {
                                              "alias": undefined,
                                              "arguments": Array [],
                                              "directives": Array [],
                                              "kind": "Field",
                                              "name": Object {
                                                "kind": "Name",
                                                "value": "forms",
                                              },
                                              "selectionSet": undefined,
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "variableDefinitions": Array [],
                                },
                              ],
                              "kind": "Document",
                              "loc": Object {
                                "end": 173,
                                "start": 0,
                              },
                            },
                            "returnPartialData": true,
                            "variables": Object {},
                            "watcher": [Circular],
                          },
                        },
                      },
                      "cancel": [Function],
                      "dirty": false,
                      "document": Object {
                        "definitions": Array [
                          Object {
                            "directives": Array [],
                            "kind": "OperationDefinition",
                            "name": Object {
                              "kind": "Name",
                              "value": "GetReCaptchaV3Config",
                            },
                            "operation": "query",
                            "selectionSet": Object {
                              "kind": "SelectionSet",
                              "selections": Array [
                                Object {
                                  "alias": undefined,
                                  "arguments": Array [],
                                  "directives": Array [],
                                  "kind": "Field",
                                  "name": Object {
                                    "kind": "Name",
                                    "value": "recaptchaV3Config",
                                  },
                                  "selectionSet": Object {
                                    "kind": "SelectionSet",
                                    "selections": Array [
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "website_key",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "badge_position",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "language_code",
                                        },
                                        "selectionSet": undefined,
                                      },
                                      Object {
                                        "alias": undefined,
                                        "arguments": Array [],
                                        "directives": Array [],
                                        "kind": "Field",
                                        "name": Object {
                                          "kind": "Name",
                                          "value": "forms",
                                        },
                                        "selectionSet": undefined,
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                            "variableDefinitions": Array [],
                          },
                        ],
                        "kind": "Document",
                        "loc": Object {
                          "end": 173,
                          "start": 0,
                        },
                      },
                      "graphQLErrors": Array [],
                      "lastDiff": Object {
                        "diff": Object {
                          "complete": false,
                          "missing": Array [
                            MissingFieldError {
                              "message": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                              "path": Object {
                                "recaptchaV3Config": "Can't find field 'recaptchaV3Config' on ROOT_QUERY object",
                              },
                              "query": Object {
                                "definitions": Array [
                                  Object {
                                    "directives": Array [],
                                    "kind": "OperationDefinition",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "GetReCaptchaV3Config",
                                    },
                                    "operation": "query",
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "recaptchaV3Config",
                                          },
                                          "selectionSet": Object {
                                            "kind": "SelectionSet",
                                            "selections": Array [
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "website_key",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "badge_position",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "language_code",
                                                },
                                                "selectionSet": undefined,
                                              },
                                              Object {
                                                "alias": undefined,
                                                "arguments": Array [],
                                                "directives": Array [],
                                                "kind": "Field",
                                                "name": Object {
                                                  "kind": "Name",
                                                  "value": "forms",
                                                },
                                                "selectionSet": undefined,
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    "variableDefinitions": Array [],
                                  },
                                ],
                                "kind": "Document",
                                "loc": Object {
                                  "end": 173,
                                  "start": 0,
                                },
                              },
                              "variables": Object {},
                            },
                          ],
                          "result": Object {},
                        },
                        "options": Object {
                          "canonizeResults": undefined,
                          "optimistic": true,
                          "query": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "GetReCaptchaV3Config",
                                },
                                "operation": "query",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "recaptchaV3Config",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "website_key",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "badge_position",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "language_code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "forms",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 173,
                              "start": 0,
                            },
                          },
                          "returnPartialData": true,
                          "variables": Object {},
                        },
                      },
                      "lastRequestId": 1,
                      "lastWatch": Object {
                        "callback": [Function],
                        "canonizeResults": undefined,
                        "optimistic": true,
                        "query": Object {
                          "definitions": Array [
                            Object {
                              "directives": Array [],
                              "kind": "OperationDefinition",
                              "name": Object {
                                "kind": "Name",
                                "value": "GetReCaptchaV3Config",
                              },
                              "operation": "query",
                              "selectionSet": Object {
                                "kind": "SelectionSet",
                                "selections": Array [
                                  Object {
                                    "alias": undefined,
                                    "arguments": Array [],
                                    "directives": Array [],
                                    "kind": "Field",
                                    "name": Object {
                                      "kind": "Name",
                                      "value": "recaptchaV3Config",
                                    },
                                    "selectionSet": Object {
                                      "kind": "SelectionSet",
                                      "selections": Array [
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "website_key",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "badge_position",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "language_code",
                                          },
                                          "selectionSet": undefined,
                                        },
                                        Object {
                                          "alias": undefined,
                                          "arguments": Array [],
                                          "directives": Array [],
                                          "kind": "Field",
                                          "name": Object {
                                            "kind": "Name",
                                            "value": "forms",
                                          },
                                          "selectionSet": undefined,
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              "variableDefinitions": Array [],
                            },
                          ],
                          "kind": "Document",
                          "loc": Object {
                            "end": 173,
                            "start": 0,
                          },
                        },
                        "returnPartialData": true,
                        "variables": Object {},
                        "watcher": [Circular],
                      },
                      "listeners": Set {
                        [Function],
                      },
                      "networkError": null,
                      "networkStatus": 1,
                      "observableQuery": ObservableQuery {
                        "_subscriber": [Function],
                        "concast": Concast {
                          "_subscriber": [Function],
                          "addCount": 1,
                          "cancel": [Function],
                          "handlers": Object {
                            "complete": [Function],
                            "error": [Function],
                            "next": [Function],
                          },
                          "observers": Set {
                            Object {
                              "complete": [Function],
                              "error": [Function],
                              "next": [Function],
                            },
                            Object {
                              "error": [Function],
                              "next": [Function],
                            },
                          },
                          "promise": Promise {},
                          "reject": [Function],
                          "resolve": [Function],
                          "sources": Array [],
                          "sub": Subscription {
                            "_cleanup": [Function],
                            "_observer": Object {
                              "complete": [Function],
                              "error": [Function],
                              "next": [Function],
                            },
                            "_queue": undefined,
                            "_state": "ready",
                          },
                        },
                        "initialFetchPolicy": "cache-and-network",
                        "isTornDown": false,
                        "last": Object {
                          "result": Object {
                            "loading": true,
                            "networkStatus": 1,
                            "partial": true,
                          },
                          "variables": Object {},
                        },
                        "observer": Object {
                          "error": [Function],
                          "next": [Function],
                        },
                        "observers": Set {
                          SubscriptionObserver {
                            "_subscription": Subscription {
                              "_cleanup": [Function],
                              "_observer": Object {
                                "complete": undefined,
                                "error": [Function],
                                "next": [Function],
                              },
                              "_queue": Array [
                                Object {
                                  "type": "next",
                                  "value": Object {
                                    "loading": true,
                                    "networkStatus": 1,
                                    "partial": true,
                                  },
                                },
                              ],
                              "_state": "buffering",
                            },
                          },
                        },
                        "options": Object {
                          "fetchPolicy": "cache-and-network",
                          "notifyOnNetworkStatusChange": false,
                          "query": Object {
                            "definitions": Array [
                              Object {
                                "directives": Array [],
                                "kind": "OperationDefinition",
                                "name": Object {
                                  "kind": "Name",
                                  "value": "GetReCaptchaV3Config",
                                },
                                "operation": "query",
                                "selectionSet": Object {
                                  "kind": "SelectionSet",
                                  "selections": Array [
                                    Object {
                                      "alias": undefined,
                                      "arguments": Array [],
                                      "directives": Array [],
                                      "kind": "Field",
                                      "name": Object {
                                        "kind": "Name",
                                        "value": "recaptchaV3Config",
                                      },
                                      "selectionSet": Object {
                                        "kind": "SelectionSet",
                                        "selections": Array [
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "website_key",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "badge_position",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "language_code",
                                            },
                                            "selectionSet": undefined,
                                          },
                                          Object {
                                            "alias": undefined,
                                            "arguments": Array [],
                                            "directives": Array [],
                                            "kind": "Field",
                                            "name": Object {
                                              "kind": "Name",
                                              "value": "forms",
                                            },
                                            "selectionSet": undefined,
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                                "variableDefinitions": Array [],
                              },
                            ],
                            "kind": "Document",
                            "loc": Object {
                              "end": 173,
                              "start": 0,
                            },
                          },
                          "variables": Object {},
                        },
                        "queryId": "1",
                        "queryInfo": [Circular],
                        "queryManager": [Circular],
                        "queryName": "GetReCaptchaV3Config",
                        "subscriptions": Set {},
                      },
                      "oqListener": [Function],
                      "queryId": "1",
                      "stopped": false,
                      "subscriptions": Set {},
                      "variables": Object {},
                    },
                  },
                  "queryDeduplication": true,
                  "queryIdCounter": 2,
                  "requestIdCounter": 2,
                  "ssrMode": false,
                  "transformCache": WeakMap {},
                },
                "reFetchObservableQueries": [Function],
                "resetStore": [Function],
                "resetStoreCallbacks": Array [],
                "typeDefs": undefined,
                "version": "3.5.10",
                "watchQuery": [Function],
              },
              "loading": false,
              "reset": [Function],
            },
          ],
          "signinHandleEnterKeyPress": [Function],
          "userContext": Array [
            Object {
              "getDetailsError": "getDetails error from redux",
              "isGettingDetails": false,
            },
            Object {
              "getUserDetails": [MockFunction],
              "setToken": [MockFunction],
            },
          ],
        }
    `);
});

test('handleSubmit triggers waterfall of operations and actions', async () => {
    useAwaitQuery.mockReturnValueOnce(() => ({
        data: {
            customer: {
                email: 'john@fake.email'
            }
        }
    }));

    const [, { getCartDetails }] = useCartContext();
    const [, { getUserDetails, setToken }] = useUserContext();
    const [, { dispatch }] = useEventingContext();

    const { result } = renderHookWithProviders();

    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.isBusy).toBe(true);
    expect(setToken).toHaveBeenCalledWith(authToken, customerTokenLifetime);
    expect(getCartDetails).toHaveBeenCalled();
    expect(getUserDetails).toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "payload": Object {
            "email": "john@fake.email",
          },
          "type": "USER_SIGN_IN",
        }
    `);
});

test('handleSubmit exception is logged and resets state', async () => {
    const errorMessage = 'Oh no! Something went wrong :(';
    const [, { getUserDetails, setToken }] = useUserContext();
    setToken.mockRejectedValue(errorMessage);
    jest.spyOn(console, 'error');

    const { result } = renderHookWithProviders();

    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.isBusy).toBe(false);
    expect(getUserDetails).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(errorMessage);
});

test('handleForgotPassword triggers callbacks', () => {
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };

    const { result } = renderHookWithProviders();
    act(() => result.current.setFormApi(mockApi));
    act(() => result.current.handleForgotPassword());

    expect(initialProps.setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(initialProps.showForgotPassword).toHaveBeenCalled();
});

test('handleCreateAccount triggers callbacks', () => {
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };

    const { result } = renderHookWithProviders();
    act(() => result.current.setFormApi(mockApi));
    act(() => result.current.handleCreateAccount());

    expect(initialProps.setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(initialProps.showCreateAccount).toHaveBeenCalled();
});

test('mutation error is returned by talon', async () => {
    const signInErrorMock = {
        request: signInMock.request,
        error: new Error('Uh oh! There was an error signing in :(')
    };

    const { result } = renderHookWithProviders({ mocks: [signInErrorMock] });
    await act(() => result.current.handleSubmit(signInVariables));

    expect(result.current.errors.get('signInMutation')).toMatchInlineSnapshot(
        `[Error: Uh oh! There was an error signing in :(]`
    );
});

it('should call handleForgotPassword when Enter key is pressed', () => {
    const { result } = renderHookWithProviders();
    const { forgotPasswordHandleEnterKeyPress } = result.current;
    const enterKeyEvent = { key: 'Enter' };
    renderHook(() => forgotPasswordHandleEnterKeyPress(enterKeyEvent));
});

it('should call handleEnterKeyPress when Enter key is pressed', () => {
    const { result } = renderHookWithProviders();
    const { handleEnterKeyPress } = result.current;
    const enterKeyEvent = { key: 'Enter' };
    renderHook(() => handleEnterKeyPress(enterKeyEvent));
});
