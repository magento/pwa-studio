import React, { useState } from 'react';
import { replace } from 'react-router-dom';
import { act, create } from 'react-test-renderer';
import { useQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';

import { getRootComponent } from '../helpers';
import { useMagentoRoute } from '../useMagentoRoute';

jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');
    const useQuery = jest.fn();

    return {
        ...ApolloClient,
        useQuery
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

const log = jest.fn().mockName('log');
const Component = () => {
    log(useMagentoRoute());
    return null;
};

beforeEach(() => {
    useQuery.mockReset();
    useQuery.mockImplementation(() => {
        return {
            data: {
                urlResolver: {
                    id: 1,
                    redirectCode: 0,
                    relative_url: '/foo.html',
                    type: 'CATEGORY'
                }
            },
            loading: false
        };
    });
});

describe('returns LOADING while queries are pending', () => {
    test('urlResolver is loading', () => {
        useQuery.mockImplementation(() => {
            return { loading: true };
        });

        act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isLoading: true
        });
    });

    test('getRootComponent is pending', () => {
        act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isLoading: true
        });
    });
});

describe('returns ERROR when queries fail', () => {
    test('urlResolver fails', () => {
        useQuery.mockImplementation(() => {
            return { error: new Error() };
        });

        act(() => {
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

        act(() => {
            create(<Component />);
        });

        await act(() => {
            reject(routeError);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(1, {
            isLoading: true
        });
        expect(log).toHaveBeenNthCalledWith(2, {
            hasError: true,
            routeError
        });
    });
});

describe('returns NOT_FOUND when queries come back empty', () => {
    test('urlResolver is null', () => {
        useQuery.mockImplementation(() => {
            return {
                data: {
                    urlResolver: null
                },
                loading: false
            };
        });

        act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isNotFound: true
        });
    });
});

describe('returns REDIRECT after receiving a redirect code', () => {
    test('redirect code 301', () => {
        useQuery.mockImplementation(() => {
            return {
                data: {
                    urlResolver: {
                        id: 1,
                        redirectCode: 301,
                        relative_url: '/foo.html',
                        type: 'CATEGORY'
                    }
                },
                loading: false
            };
        });

        act(() => {
            create(<Component />);
        });

        expect(replace).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenNthCalledWith(1, {
            isRedirect: true,
            relativeUrl: '/foo.html'
        });
    });

    test('redirect code 302', () => {
        useQuery.mockImplementation(() => {
            return {
                data: {
                    urlResolver: {
                        id: 1,
                        redirectCode: 302,
                        relative_url: '/foo.html',
                        type: 'CATEGORY'
                    }
                },
                loading: false
            };
        });

        act(() => {
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
        act(() => {
            create(<Component />);
        });

        await act(() => {
            resolve('MockComponent');
        });

        expect(replace).toHaveBeenCalledTimes(0);
        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(1, {
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
        let tree;

        act(() => {
            tree = create(<Component key="a" />);
        });

        await act(() => {
            resolve('MockComponent');
        });

        act(() => {
            tree.update(<Component key="a" />);
        });

        expect(getRootComponent).toHaveBeenCalledTimes(1);
        expect(getRootComponent).toHaveBeenNthCalledWith(1, 'CATEGORY');
    });
});

describe('avoids setting state when unmounted', () => {
    test('getRootComponent resolves after unmount', async () => {
        let tree;

        act(() => {
            tree = create(<Component />);
        });

        act(() => {
            tree.unmount();
        });

        await act(() => {
            resolve('MockComponent');
        });

        expect(tree).toBeTruthy();
    });
});
