import React from 'react';
import { act, create } from 'react-test-renderer';
import { matchPath } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';
import { mockSetPageLoading } from '@magento/peregrine/lib/context/app';
import { mockSetComponentMap } from '@magento/peregrine/lib/context/rootComponents';

import { getRootComponent } from '../../talons/MagentoRoute/helpers';
import useDelayedTransition from '../useDelayedTransition';

// jest.mock('react');

jest.mock('react-router', () => ({
    matchPath: jest.fn((currentPath, route) => {
        return currentPath === route.path;
    })
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useLocation: jest.fn()
}));

jest.mock('@apollo/client', () => {
    return {
        useApolloClient: jest.fn()
    };
});

jest.mock('@magento/venia-ui/lib/components/Routes/routes', () => ({
    availableRoutes: [
        {
            pattern: '/hardcoded.html',
            exact: true
        }
    ]
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const mockSetPageLoading = jest.fn();

    return {
        useAppContext: jest.fn(() => {
            return [
                null,
                {
                    actions: {
                        setPageLoading: mockSetPageLoading
                    }
                }
            ];
        }),
        mockSetPageLoading
    };
});

jest.mock('@magento/peregrine/lib/context/rootComponents', () => {
    const mockSetComponentMap = jest.fn(fn => fn());

    return {
        useRootComponents: jest.fn(() => {
            return [null, mockSetComponentMap];
        }),
        mockSetComponentMap
    };
});

jest.mock('../../talons/MagentoRoute/magentoRoute.gql', () => ({
    resolveUrlQuery: 'resolveUrlQuery'
}));

jest.mock('../../talons/MagentoRoute/helpers', () => ({
    getRootComponent: jest.fn(() => 'RootComponent')
}));

const givenCurrentLocation = currentPath => {
    useLocation.mockImplementation(() => ({
        pathname: currentPath
    }));
};

const mockQuery = jest.fn();
const givenQueryResult = result => {
    mockQuery.mockImplementation(() => result);
    useApolloClient.mockImplementation(() => ({
        query: mockQuery
    }));
};

const mockUnblock = jest.fn();
const mockBlock = jest.fn();

let blockFunction;
let blockResult;
const whenRunningBlock = nextLocation => {
    blockResult = blockFunction(nextLocation);
};

const mockProceed = jest.fn();
const whenRunningConfirm = () => {
    return globalThis.handleRouteChangeConfirmation(blockResult, mockProceed);
};

const TestComponent = () => {
    useDelayedTransition();

    return null;
};

let tree;
const whenMountingComponent = () => {
    return act(() => {
        tree = create(<TestComponent key="a" />);
    });
};

const whenUpdatingComponent = () => {
    return act(() => {
        tree.update(<TestComponent key="a" />);
    });
};

beforeEach(() => {
    tree = null;
    blockFunction = null;
    blockResult = null;

    useHistory.mockImplementation(() => ({
        block: mockBlock
    }));

    givenCurrentLocation('/foo.html');

    mockBlock.mockClear();
    mockBlock.mockImplementation(fn => {
        blockFunction = fn;

        return mockUnblock;
    });
    mockUnblock.mockClear();
    matchPath.mockClear();

    givenQueryResult({ data: null });

    mockProceed.mockClear();
    mockSetPageLoading.mockClear();
    mockSetComponentMap.mockClear();
    getRootComponent.mockClear();
    mockQuery.mockClear();
});

describe('#useDelayedTransition registers history blocker', () => {
    test('should add history blocker', async () => {
        await whenMountingComponent();

        expect(mockBlock).toHaveBeenCalled();
        expect(blockFunction).toBeInstanceOf(Function);
    });

    test('should remove history blocker when location changes', async () => {
        await whenMountingComponent();

        givenCurrentLocation('/bar.html');

        await whenUpdatingComponent();

        expect(mockBlock).toHaveBeenCalled();
        expect(mockUnblock).toHaveBeenCalled();
    });

    test('should ignore query string changes', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/foo.html',
            search: '?query=value'
        });

        expect(blockResult).toBe(true);
    });

    test('should ignore hardcoded routes', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/hardcoded.html'
        });

        expect(matchPath).toHaveBeenCalledWith('/hardcoded.html', {
            path: '/hardcoded.html',
            exact: true
        });
        expect(blockResult).toBe(true);
    });

    test('should pass on next pathname in message', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/baz.html'
        });

        expect(blockResult).toBe('DELAY:/baz.html');
    });

    test('should bypasses beforeunload event registration', async () => {
        const spyAddEventListener = jest.spyOn(globalThis, 'addEventListener');
        const originalGlobalAddEventListener = globalThis.addEventListener;

        mockBlock.mockImplementation(() => {
            globalThis.addEventListener('beforeunload');
            globalThis.addEventListener('someotherevent');
        });

        await whenMountingComponent();

        const wasCalledWithBeforeUnload = spyAddEventListener.mock.calls.some(
            ([eventType]) => {
                return eventType === 'beforeunload';
            }
        );
        const wasCalledWithOther = spyAddEventListener.mock.calls.some(
            ([eventType]) => {
                return eventType === 'someotherevent';
            }
        );

        // Test reset
        expect(globalThis.addEventListener).toEqual(
            originalGlobalAddEventListener
        );
        // Test bypass
        expect(wasCalledWithBeforeUnload).toBe(false);
        expect(wasCalledWithOther).toBe(true);
    });
});

describe('#useDelayedTransition handleRouteChangeConfirmation', () => {
    test('should proceed after', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/bar.html'
        });

        await whenRunningConfirm();

        expect(mockSetPageLoading).toHaveBeenNthCalledWith(1, true);
        expect(mockSetPageLoading).toHaveBeenNthCalledWith(2, false);
        expect(mockUnblock).toHaveBeenCalledTimes(1);
        expect(mockProceed).toHaveBeenCalledTimes(1);
    });

    test('should query route information based on message', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/bar.html'
        });

        await whenRunningConfirm();

        expect(mockQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { url: '/bar.html' }
            })
        );
    });

    test('should get root component', async () => {
        givenQueryResult({
            data: {
                route: {
                    type: 'BAR_PAGE',
                    id: 'BAR123'
                }
            }
        });

        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/bar.html'
        });

        await whenRunningConfirm();

        const expectedComponentMap = new Map().set('/bar.html', {
            component: 'RootComponent',
            id: 'BAR123',
            type: 'BAR_PAGE'
        });

        expect(getRootComponent).toHaveBeenCalledWith('BAR_PAGE');
        expect(mockSetComponentMap).toHaveReturnedWith(expectedComponentMap);
    });

    test('should not get root component when invalid route', async () => {
        await whenMountingComponent();

        whenRunningBlock({
            pathname: '/baz.html'
        });

        await whenRunningConfirm();

        expect(getRootComponent).not.toHaveBeenCalled();
        expect(mockSetComponentMap).not.toHaveBeenCalled();
    });
});
