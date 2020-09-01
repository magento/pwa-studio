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

const mockHistoryReplace = jest.fn();
jest.mock('react-router-dom', () => {
    const ReactRouterDOM = jest.requireActual('react-router-dom');

    return {
        ...ReactRouterDOM,
        useHistory: () => ({ replace: mockHistoryReplace }),
        useLocation: jest.fn(() => ({ pathname: 'Unit Test Pathname' }))
    };
});
jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn(() => ({ apiBase: 'Unit Test API Base' }))
}));
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
        type: 'PRODUCT',
        store: 'default'
    },
    COMPONENT_NOT_FOUND: {
        isNotFound: true
    },
    ERROR: {
        hasError: true,
        routeError: 'INTERNAL_ERROR'
    },
    REDIRECT: {
        isRedirect: true,
        relativeUrl: '/some/redirect'
    }
};

const props = {
    store: 'default'
};

/*
 *  Tests.
 */
beforeEach(() => {
    getRouteComponent.mockReset();
});

it('fetches a component when it doesnt exist in local state', () => {
    // Arrange.
    useState.mockReturnValueOnce([new Map(), jest.fn()]);
    getRouteComponent.mockImplementationOnce(() => {
        return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
    });

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(getRouteComponent).toHaveBeenCalled();
});

it('does not fetch when a match exists in local state', () => {
    // Arrange.
    const componentMap = new Map().set(
        'Unit Test Pathname',
        routeComponentResults.COMPONENT_FOUND
    );
    useState.mockReturnValueOnce([componentMap, jest.fn()]);

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(getRouteComponent).not.toHaveBeenCalled();
});

it('refetches when the stores do not match', () => {
    // Arrange.
    const componentMap = new Map().set(
        'Unit Test Pathname',
        routeComponentResults.COMPONENT_FOUND
    );
    useState.mockReturnValueOnce([componentMap, jest.fn()]);
    getRouteComponent.mockImplementationOnce(() => {
        return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
    });

    props.store = 'other';

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(getRouteComponent).toHaveBeenCalled();
});

it('redirects when instructed', () => {
    // Arrange.
    const componentMap = new Map().set(
        'Unit Test Pathname',
        routeComponentResults.REDIRECT
    );
    useState.mockReturnValueOnce([componentMap, jest.fn()]);

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(mockHistoryReplace).toHaveBeenCalledWith(
        routeComponentResults.REDIRECT.relativeUrl
    );
});

it('refetches data when component is not found and user is online', () => {
    // Arrange.
    const componentMap = new Map().set(
        'Unit Test Pathname',
        routeComponentResults.COMPONENT_NOT_FOUND
    );
    useState.mockReturnValueOnce([componentMap, jest.fn()]);
    getRouteComponent.mockImplementationOnce(() => {
        return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
    });

    // Mock being online.
    const onLineGetter = jest.spyOn(global.navigator, 'onLine', 'get');
    onLineGetter.mockReturnValue(true);

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(getRouteComponent).toHaveBeenCalled();
});

it('does not refetch data when component is not found but user is offline', () => {
    // Arrange.
    const componentMap = new Map().set(
        'Unit Test Pathname',
        routeComponentResults.COMPONENT_NOT_FOUND
    );
    useState.mockReturnValueOnce([componentMap, jest.fn()]);
    getRouteComponent.mockImplementationOnce(() => {
        return Promise.resolve(routeComponentResults.COMPONENT_FOUND);
    });

    // Mock being offline.
    const onLineGetter = jest.spyOn(global.navigator, 'onLine', 'get');
    onLineGetter.mockReturnValue(false);

    // Act.
    act(() => {
        createTestInstance(<Component {...props} />);
    });

    // Assert.
    expect(getRouteComponent).not.toHaveBeenCalled();
});
