import React, { useState } from 'react';
import { act, create } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import { useAppContext } from '../../../context/app';
import { useLocation } from 'react-router-dom';

import { getRootComponent } from '../helpers';
import { useMagentoRoute } from '../useMagentoRoute';

jest.mock('../../../context/app', () => {
    const useAppContext = jest.fn();

    return { useAppContext };
});

const runQuery = jest.fn();

jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');
    const useLazyQuery = jest.fn();

    return {
        ...ApolloClient,
        useLazyQuery
    };
});

jest.mock('react-router-dom', () => {
    const ReactRouter = jest.requireActual('react-router-dom');
    const replace = jest.fn();
    const useHistory = jest.fn(() => ({ replace }));
    const useLocation = jest.fn(() => ({ pathname: '/foo.html' }));

    return {
        ...ReactRouter,
        useHistory,
        useLocation,
        replace
    };
});

jest.mock('@magento/peregrine/lib/context/rootComponents', () => ({
    useRootComponents: jest.fn()
}));

jest.mock('../helpers', () => {
    const helpers = jest.requireActual('../helpers');

    return {
        ...helpers,
        getRootComponent: jest.fn()
    };
});

const resolve = jest.fn();
const reject = jest.fn();
const log = jest.fn();

const Component = () => {
    log(useMagentoRoute());
    return null;
};

const mountedTrees = new Set();

const mount = element => {
    const tree = create(element);
    mountedTrees.add(tree);
    return tree;
};

const unmount = async tree => {
    if (tree && mountedTrees.has(tree)) {
        await act(async () => {
            tree.unmount();
        });
        mountedTrees.delete(tree);
    }
};

const givenQueryResult = response => {
    useLazyQuery.mockReset();
    runQuery.mockReset();

    const queryPromise = Promise.resolve(response);

    // Keep the execute function stable across renders. A new function
    // on every render can retrigger the hook's query effect indefinitely.
    runQuery.mockImplementation(() => queryPromise);
    useLazyQuery.mockImplementation(() => [runQuery, response]);
};

const givenInlinedPageData = () => {
    globalThis.INLINED_PAGE_TYPE = {
        id: 1,
        redirect_code: 0,
        relative_url: '/home.html',
        type: 'CMS_PAGE'
    };
};

const givenEmptyInlinedPageData = () => {
    globalThis.INLINED_PAGE_TYPE = false;
};

beforeEach(() => {
    log.mockClear();

    givenEmptyInlinedPageData();

    givenQueryResult({
        data: {
            route: {
                id: 1,
                redirect_code: 0,
                relative_url: '/foo.html',
                type: 'CATEGORY'
            }
        },
        loading: false
    });

    useLocation.mockReset();
    useLocation.mockImplementation(() => ({ pathname: '/foo.html' }));

    useRootComponents.mockImplementation(() => useState(new Map()));

    useAppContext.mockImplementation(() => {
        const state = {
            nextRootComponent: null,
            isPageLoading: false
        };

        const api = {
            actions: {
                setNextRootComponent: jest.fn(),
                setPageLoading: jest.fn()
            }
        };

        return [state, api];
    });

    getRootComponent.mockReset();
    resolve.mockReset();
    reject.mockReset();

    getRootComponent.mockImplementation(
        () =>
            new Promise((res, rej) => {
                resolve.mockImplementation(res);
                reject.mockImplementation(rej);
            })
    );

    // Reset the mocked navigation function between tests.
    const { replace } = require('react-router-dom');
    replace.mockReset();
});

afterEach(async () => {
    for (const tree of Array.from(mountedTrees)) {
        await unmount(tree);
    }

    delete globalThis.INLINED_PAGE_TYPE;
});

describe('returns LOADING while queries are pending', () => {
    test('urlResolver is loading', async () => {
        givenQueryResult({ loading: true });

        await act(async () => {
            mount(<Component />);
        });

        expect(log).toHaveBeenCalledWith({
            initial: false,
            isLoading: true
        });
    });

    test('getRootComponent is pending', async () => {
        await act(async () => {
            mount(<Component />);
        });

        expect(getRootComponent).toHaveBeenCalledWith('CATEGORY');
        expect(log).toHaveBeenCalledWith({
            initial: false,
            isLoading: true
        });
    });
});

describe('returns NOT_FOUND when queries come back empty', () => {
    test('urlResolver is null', async () => {
        givenQueryResult({
            data: { route: null },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        expect(getRootComponent).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith({
            isNotFound: true
        });
    });

    test('identifier is invalid', async () => {
        givenQueryResult({
            data: {
                route: {
                    type: 'CMS',
                    id: 0,
                    identifier: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        expect(getRootComponent).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith({
            isNotFound: true
        });
    });
});

describe('returns REDIRECT after receiving a redirect code', () => {
    test('redirect code 301', async () => {
        givenQueryResult({
            data: {
                route: {
                    redirect_code: 301,
                    relative_url: '/target.html',
                    type: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        const { replace } = require('react-router-dom');

        expect(replace).toHaveBeenCalledWith('/target.html');
        expect(log).toHaveBeenCalledWith({
            isRedirect: true,
            relativeUrl: '/target.html'
        });
    });

    test('redirect adds a slash when appropriate', async () => {
        givenQueryResult({
            data: {
                route: {
                    redirect_code: 302,
                    relative_url: 'no_preceding_slash.html',
                    type: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        const { replace } = require('react-router-dom');

        expect(replace).toHaveBeenCalledWith('/no_preceding_slash.html');
        expect(log).toHaveBeenCalledWith({
            isRedirect: true,
            relativeUrl: '/no_preceding_slash.html'
        });
    });

    test('redirect code 302', async () => {
        givenQueryResult({
            data: {
                route: {
                    redirect_code: 302,
                    relative_url: '/target.html',
                    type: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        const { replace } = require('react-router-dom');

        expect(replace).toHaveBeenCalledWith('/target.html');
        expect(log).toHaveBeenCalledWith({
            isRedirect: true,
            relativeUrl: '/target.html'
        });
    });

    test('does not replace when the redirect target is the current pathname', async () => {
        givenQueryResult({
            data: {
                route: {
                    redirect_code: 301,
                    relative_url: '/foo.html',
                    type: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        const { replace } = require('react-router-dom');

        expect(replace).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith({
            isRedirect: true,
            relativeUrl: '/foo.html'
        });
    });
});

describe('handles redirects to missing destinations', () => {
    test('redirects to the destination and returns NOT_FOUND for that pathname', async () => {
        const sourcePath = '/request-redirect-invalid-target';
        const targetPath = '/a-non-existing-url';
        const { replace } = require('react-router-dom');

        useLocation.mockImplementation(() => ({
            pathname: sourcePath
        }));

        givenQueryResult({
            data: {
                route: {
                    relative_url: targetPath,
                    redirect_code: 302,
                    type: null
                }
            },
            loading: false
        });

        let sourceTree;

        await act(async () => {
            sourceTree = mount(<Component />);
        });

        expect(replace).toHaveBeenCalledWith(targetPath);
        expect(log).toHaveBeenCalledWith({
            isRedirect: true,
            relativeUrl: targetPath
        });

        await unmount(sourceTree);

        // Simulate the router rendering the destination after replace().
        useLocation.mockImplementation(() => ({
            pathname: targetPath
        }));

        log.mockClear();
        replace.mockClear();

        givenQueryResult({
            data: {
                route: {
                    relative_url: targetPath,
                    redirect_code: 404,
                    type: null
                }
            },
            loading: false
        });

        await act(async () => {
            mount(<Component />);
        });

        expect(log).toHaveBeenCalledWith({
            isNotFound: true
        });
        expect(replace).not.toHaveBeenCalled();
        expect(getRootComponent).not.toHaveBeenCalled();
    });
});

describe('returns FOUND after fetching a component', () => {
    test('getRootComponent succeeds', async () => {
        await act(async () => {
            mount(<Component />);
        });

        await act(async () => {
            resolve('MockComponent');
        });

        expect(log).toHaveBeenCalledWith({
            component: 'MockComponent',
            id: 1,
            type: 'CATEGORY'
        });
    });
});

describe('avoids fetching the same component twice', () => {
    test('getRootComponent succeeds', async () => {
        givenQueryResult({
            data: {
                route: {
                    id: 1,
                    type: 'CATEGORY'
                }
            },
            loading: false
        });

        let tree;

        await act(async () => {
            tree = mount(<Component />);
        });

        await act(async () => {
            resolve('MockComponent');
        });

        await act(async () => {
            tree.update(<Component />);
        });

        expect(getRootComponent).toHaveBeenCalledTimes(1);
        expect(getRootComponent).toHaveBeenCalledWith('CATEGORY');
    });
});

describe('avoids setting state when unmounted', () => {
    test('getRootComponent resolves after unmount', async () => {
        let tree;

        await act(async () => {
            tree = mount(<Component />);
        });

        await unmount(tree);

        await act(async () => {
            resolve('MockComponent');
        });

        expect(tree).toBeTruthy();
    });
});

describe('loading type', () => {
    test('is returned', async () => {
        useAppContext.mockImplementationOnce(() => {
            const state = {
                nextRootComponent: 'TEST_TYPE_SHIMMER',
                isPageLoading: false
            };

            const api = {
                actions: {
                    setNextRootComponent: jest.fn(),
                    setPageLoading: jest.fn()
                }
            };

            return [state, api];
        });

        givenQueryResult({ loading: true });

        await act(async () => {
            mount(<Component />);
        });

        expect(log).toHaveBeenCalledWith({
            isLoading: true,
            shimmer: 'TEST_TYPE_SHIMMER'
        });
    });

    test('is reset when component is returned', async () => {
        let mockNextRootComponent = 'TEST_TYPE_SHIMMER';

        const mockSetNextRootComponent = jest.fn(type => {
            mockNextRootComponent = type;
        });

        useAppContext.mockImplementation(() => {
            const state = {
                nextRootComponent: mockNextRootComponent,
                isPageLoading: false
            };

            const api = {
                actions: {
                    setNextRootComponent: mockSetNextRootComponent,
                    setPageLoading: jest.fn()
                }
            };

            return [state, api];
        });

        let tree;

        await act(async () => {
            tree = mount(<Component />);
        });

        givenQueryResult({
            data: {
                route: {
                    id: 1,
                    type: 'CATEGORY'
                }
            },
            loading: false
        });

        await act(async () => {
            tree.update(<Component />);
        });

        await act(async () => {
            resolve('MockComponent');
        });

        await act(async () => {
            tree.update(<Component />);
        });

        expect(getRootComponent).toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith({
            isLoading: true,
            shimmer: 'TEST_TYPE_SHIMMER'
        });
        expect(mockSetNextRootComponent).toHaveBeenCalledWith(null);
    });
});

describe('handles INLINED_PAGE_TYPE', () => {
    test('returns initial loading state', async () => {
        givenInlinedPageData();

        await act(async () => {
            mount(<Component />);
        });

        expect(log).toHaveBeenCalledWith({
            initial: true,
            isLoading: true
        });
    });

    test('uses inlined data to get root component', async () => {
        givenInlinedPageData();

        await act(async () => {
            mount(<Component />);
        });

        expect(runQuery).not.toHaveBeenCalled();
        expect(getRootComponent).toHaveBeenCalledWith('CMS_PAGE');
    });
});

// Keep these tests last because rejecting the root-component promise
// can affect asynchronous state updates.
describe('returns ERROR when queries fail', () => {
    test('urlResolver fails', async () => {
        givenQueryResult({ error: new Error() });

        await act(async () => {
            mount(<Component />);
        });

        expect(log).toHaveBeenCalledWith({
            hasError: true,
            routeError: expect.any(Error)
        });
    });

    test('getRootComponent fails', async () => {
        const routeError = new Error();

        await act(async () => {
            mount(<Component />);
        });

        await act(async () => {
            reject(routeError);
        });

        expect(log).toHaveBeenCalledWith({
            hasError: true,
            routeError
        });
    });
});
