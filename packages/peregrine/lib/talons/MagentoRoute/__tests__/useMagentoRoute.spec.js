import React, { useState } from 'react';
import { replace, useLocation } from 'react-router-dom';
import { act, create } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import { useAppContext } from '../../../context/app';

import { getRootComponent } from '../helpers';
import { useMagentoRoute } from '../useMagentoRoute';

jest.mock('../../../context/app', () => {
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
    const useAppContext = jest.fn(() => [state, api]);

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

const givenQueryResult = response => {
    useLazyQuery.mockReset();
    runQuery.mockReset();
    useLazyQuery.mockImplementation(() => {
        return [runQuery, response];
    });
};

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
useRootComponents.mockImplementation(() => useState(new Map()));

jest.mock('../helpers', () => {
    const helpers = jest.requireActual('../helpers');
    const getRootComponent = jest.fn();

    return {
        ...helpers,
        getRootComponent
    };
});

const resolve = jest.fn().mockName('resolve');
const reject = jest.fn().mockName('reject');
getRootComponent.mockImplementation(
    () =>
        new Promise((res, rej) => {
            resolve.mockImplementation(res);
            reject.mockImplementation(rej);
        })
);

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

const log = jest.fn().mockName('log');
const Component = () => {
    log(useMagentoRoute());
    return null;
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
    useLocation.mockReset();
    useLocation.mockImplementation(() => ({ pathname: '/foo.html' }));

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
});

describe('returns LOADING while queries are pending', () => {
    test('urlResolver is loading', async () => {
        givenQueryResult({ loading: true });

        await act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            initial: false,
            isLoading: true
        });
    });

    test('getRootComponent is pending', async () => {
        await act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            initial: false,
            isLoading: true
        });
    });
});

describe('returns NOT_FOUND when queries come back empty', () => {
    test('urlResolver is null', async () => {
        givenQueryResult({
            data: {
                route: null
            },
            loading: false
        });

        let tree;

        await act(() => {
            tree = create(<Component key="a" />);
        });

        await act(() => {
            tree.update(<Component key="a" />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(getRootComponent).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(2, {
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

        let tree;

        await act(() => {
            tree = create(<Component key="a" />);
        });

        await act(() => {
            tree.update(<Component key="a" />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(getRootComponent).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(2, {
            isNotFound: true
        });
    });
});

describe('returns REDIRECT after receiving a redirect code', () => {
    test('redirect code 301', async () => {
        givenQueryResult({
            data: {
                route: {
                    id: 1,
                    redirect_code: 301,
                    relative_url: '/foo.html',
                    type: 'CATEGORY'
                }
            },
            loading: false
        });

        await act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isRedirect: true,
            relativeUrl: '/foo.html'
        });
    });

    test('redirect adds a slash when appropriate', async () => {
        // Arrange: the relative_url does not have a '/'
        const relative_url = 'no_preceding_slash.html';
        givenQueryResult({
            data: {
                route: {
                    id: 1,
                    redirect_code: 302,
                    relative_url,
                    type: 'CATEGORY'
                }
            },
            loading: false
        });

        // Act
        await act(() => {
            create(<Component />);
        });

        // Assert
        expect(replace).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isRedirect: true,
            relativeUrl: '/no_preceding_slash.html'
        });
    });

    test('redirect code 302', async () => {
        givenQueryResult({
            data: {
                route: {
                    id: 1,
                    redirect_code: 302,
                    relative_url: '/foo.html',
                    type: 'CATEGORY'
                }
            },
            loading: false
        });

        await act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isRedirect: true,
            relativeUrl: '/foo.html'
        });
    });
});

describe('returns FOUND after fetching a component', () => {
    test('getRootComponent succeeds', async () => {
        await act(() => {
            create(<Component />);
        });

        await act(() => {
            resolve('MockComponent');
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(1, {
            initial: false,
            isLoading: true
        });
        expect(log).toHaveBeenNthCalledWith(2, {
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

        await act(() => {
            tree = create(<Component key="a" />);
        });

        await act(() => {
            resolve('MockComponent');
        });

        await act(() => {
            tree.update(<Component key="a" />);
        });

        expect(getRootComponent).toHaveBeenCalledTimes(1);
        expect(getRootComponent).toHaveBeenNthCalledWith(1, 'CATEGORY');
    });
});

describe('avoids setting state when unmounted', () => {
    test('getRootComponent resolves after unmount', async () => {
        let tree;

        await act(() => {
            tree = create(<Component />);
        });

        await act(() => {
            tree.unmount();
        });

        await act(() => {
            resolve('MockComponent');
        });

        expect(tree).toBeTruthy();
    });
});

describe('loading type', async () => {
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

        await act(() => {
            create(<Component />);
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
        await act(() => {
            tree = create(<Component key="a" />);
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

        await act(() => {
            tree.update(<Component key="a" />);
        });

        await act(() => {
            resolve('MockComponent');
        });

        await act(() => {
            tree.update(<Component key="a" />);
        });

        expect(getRootComponent).toHaveBeenCalled();

        expect(log).toHaveBeenNthCalledWith(1, {
            isLoading: true,
            shimmer: 'TEST_TYPE_SHIMMER'
        });

        expect(mockSetNextRootComponent).toHaveBeenCalledWith(null);
    });
});

describe('handles INLINED_PAGE_TYPE', () => {
    test('returns initial loading state', async () => {
        givenInlinedPageData();

        await act(() => {
            create(<Component key="a" />);
        });

        expect(log).toHaveBeenNthCalledWith(1, {
            initial: true,
            isLoading: true
        });
    });

    test('uses inlined data to get root component', async () => {
        givenInlinedPageData();

        await act(() => {
            create(<Component key="a" />);
        });

        expect(runQuery).not.toHaveBeenCalled();

        expect(getRootComponent).toHaveBeenCalled();
    });
});

// This test must be last as reject(routeError) causes next tests to fail
describe('returns ERROR when queries fail', () => {
    test('urlResolver fails', async () => {
        givenQueryResult({ error: new Error() });

        await act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            hasError: true,
            routeError: expect.any(Error)
        });
    });

    test('getRootComponent fails', async () => {
        const routeError = new Error();

        await act(() => {
            create(<Component />);
        });

        await act(() => {
            reject(routeError);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(1, {
            initial: false,
            isLoading: true
        });
        expect(log).toHaveBeenNthCalledWith(2, {
            hasError: true,
            routeError
        });
    });
});
