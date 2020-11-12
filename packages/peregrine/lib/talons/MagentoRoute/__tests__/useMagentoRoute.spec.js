import React, { useEffect } from 'react';
import { act, create } from 'react-test-renderer';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import { GET_STORE_CODE, RESOLVE_URL } from '../magentoRoute.gql';
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
        useLocation
    };
});

jest.mock('../helpers', () => {
    const helpers = jest.requireActual('../helpers');
    const getRootComponent = jest.fn(() => 'MockComponent');

    return {
        ...helpers,
        getRootComponent
    };
});

useQuery.mockImplementation(query => {
    if (query === GET_STORE_CODE) {
        return {
            data: {
                storeConfig: {
                    code: 'en'
                }
            },
            loading: false
        };
    } else if (query === RESOLVE_URL) {
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
    }
});

/*
 *  Members.
 */
const log = jest.fn();
const Component = () => {
    const talonOutput = useMagentoRoute();

    useEffect(() => {
        log(talonOutput);
    }, [talonOutput]);

    return null;
};

test('returns LOADING while fetching a component', () => {
    createTestInstance(<Component />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, {
        isLoading: true
    });
});

test('returns FOUND after fetching a component', async () => {
    await act(async () => {
        create(<Component />);
    });

    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(2, {
        isLoading: true
    });
    expect(log).toHaveBeenNthCalledWith(3, {
        component: 'MockComponent',
        id: 1,
        type: 'CATEGORY'
    });
});
