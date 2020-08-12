/*
 *  Imports.
 */
import React, { useEffect, useState } from 'react';
import { createTestInstance } from '@magento/peregrine';

import getRouteComponent from '../getRouteComponent';
import { useMagentoRoute } from '../useMagentoRoute';
import { act } from 'react-test-renderer';

/*
 *  Mocks.
 */
jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ pathname: 'Unit Test Pathname' }))
}));
jest.mock('@apollo/react-hooks', () => ({
    useApolloClient: jest.fn(() => ({ apiBase: 'Unit Test API Base' }))
}));
jest.mock('../addToCache', () => jest.fn());
jest.mock('../getRouteComponent', () => jest.fn());

/*
 *  Members.
 */
const log = jest.fn();
const Component = props => {
    const hookProps = useMagentoRoute({ ...props });

    useEffect(() => {
        log(hookProps);
    }, [hookProps]);

    return null;
};

const routeComponentResults = {
    COMPONENT_FOUND: {
        component: {},
        id: 1,
        redirectCode: 0,
        relativeUrl: null,
        routeError: null
    },
    COMPONENT_NOT_FOUND: {
        component: null,
        id: -1,
        redirectCode: 0,
        relativeUrl: null,
        routeError: null
    },
    ERROR: {
        component: null,
        id: 2,
        redirectCode: null,
        relativeUrl: null,
        routeError: new Error('Route Error')
    },
    REDIRECT: {
        component: null,
        id: 3,
        redirectCode: 301,
        relativeUrl: '/some/redirect',
        routeError: null
    }
};

const props = {};

/*
 *  Tests.
 */
describe('returns the correct values', () => {
    beforeEach(() => {
        getRouteComponent.mockReset();
    });

    it('when component is loading', async () => {
        // Arrange.
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
        });

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        const loggedWhileLoading = log.mock.calls[0][0];
        expect(Object.keys(loggedWhileLoading)).toEqual([
            'component',
            'id',
            'isLoading',
            'routeError'
        ]);
        expect(loggedWhileLoading.component).toBeFalsy();
        expect(loggedWhileLoading.isLoading).toBeTruthy();
    });

    it('when component is found', async () => {
        // Arrange.
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
        });

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        const loggedAfterLoading = log.mock.calls[1][0];
        expect(Object.keys(loggedAfterLoading)).toEqual([
            'component',
            'id',
            'isLoading',
            'routeError'
        ]);
        expect(loggedAfterLoading.component).toBeTruthy();
        expect(loggedAfterLoading.isLoading).toBeFalsy();
    });

    it('when component is not found', async () => {
        // Arrange.
        const notFoundRoute = {
            component: null,
            id: -1,
            isLoading: false,
            routeError: null
        };
        const initialComponentMap = new Map().set(
            'Unit Test Pathname',
            notFoundRoute
        );
        const setComponentMap = jest.fn();
        useState.mockReturnValueOnce([initialComponentMap, setComponentMap]);

        // Mock being offline.
        const onLineGetter = jest.spyOn(global.navigator, 'onLine', 'get');
        onLineGetter.mockReturnValue(false);

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        const loggedAfterLoading = log.mock.calls[0][0];
        expect(Object.keys(loggedAfterLoading)).toEqual([
            'component',
            'id',
            'isLoading',
            'routeError'
        ]);
        expect(loggedAfterLoading).toEqual(notFoundRoute);
    });
});

describe('algorithm behaves as expected', () => {
    beforeEach(() => {
        getRouteComponent.mockReset();
    });

    it('hits network for route data if not in state initially', async () => {
        // Arrange.
        useState.mockReturnValueOnce([new Map(), jest.fn()]);
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
        });

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).toHaveBeenCalledTimes(1);
    });

    it('does not hit network if state data is good', async () => {
        // Arrange.
        const componentMap = new Map().set('Unit Test Pathname', {
            component: {},
            id: 1
        });
        useState.mockReturnValueOnce([componentMap, jest.fn()]);

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).not.toHaveBeenCalled();
    });

    it('hits network for route data if online and existing state data is bad', async () => {
        // Arrange.
        const componentMap = new Map().set('Unit Test Pathname', {
            component: null,
            id: -1
        });
        useState.mockReturnValueOnce([componentMap, jest.fn()]);
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
        });

        // Mock being online.
        const onLineGetter = jest.spyOn(global.navigator, 'onLine', 'get');
        onLineGetter.mockReturnValue(true);

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).toHaveBeenCalledTimes(1);
    });

    it('does not hit network for route data if offline and existing state data is bad', async () => {
        // Arrange.
        const componentMap = new Map().set('Unit Test Pathname', {
            component: null,
            id: -1
        });
        useState.mockReturnValueOnce([componentMap, jest.fn()]);
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
        });

        // Mock being offline.
        const onLineGetter = jest.spyOn(global.navigator, 'onLine', 'get');
        onLineGetter.mockReturnValue(false);

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).not.toHaveBeenCalled();
    });

    it('follows a redirect', async () => {
        // Arrange: we have the redirect route's info already in state.
        const componentMap = new Map().set(
            routeComponentResults.REDIRECT.relativeUrl,
            {
                component: {},
                id: 77
            }
        );
        useState.mockReturnValueOnce([componentMap, jest.fn()]);
        getRouteComponent.mockImplementationOnce(() => {
            return Promise.resolve(routeComponentResults.REDIRECT);
        });

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).toHaveBeenCalledTimes(1);
    });

    it('follows multiple redirects', async () => {
        // Arrange
        const terminatingRedirectPathname = 'unit test: multiple redirects';
        const componentMap = new Map().set(terminatingRedirectPathname, {
            component: {},
            id: 77
        });
        useState.mockReturnValueOnce([componentMap, jest.fn()]);
        getRouteComponent
            .mockImplementationOnce(() =>
                Promise.resolve(routeComponentResults.REDIRECT)
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ...routeComponentResults.REDIRECT,
                    relativeUrl: terminatingRedirectPathname
                })
            );

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).toHaveBeenCalledTimes(2);
    });

    it('bails out of circular redirects', async () => {
        // Arrange: redirect more times than the max number of retries.
        useState.mockReturnValueOnce([new Map(), jest.fn()]);
        const redirectBack = {
            ...routeComponentResults.REDIRECT,
            redirectUrl: '/loop/redirect'
        };
        getRouteComponent
            .mockImplementationOnce(() =>
                Promise.resolve(routeComponentResults.REDIRECT)
            )
            .mockImplementationOnce(() => Promise.resolve(redirectBack))
            .mockImplementationOnce(() =>
                Promise.resolve(routeComponentResults.REDIRECT)
            );

        // Act.
        await act(async () => {
            createTestInstance(<Component {...props} />);
        });

        // Assert.
        expect(getRouteComponent).toHaveBeenCalledTimes(2);
    });
});
