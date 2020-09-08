import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderHistoryPage } from '../useOrderHistoryPage';
import { useAppContext } from '../../../context/app';

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => ({ push: jest.fn() }))
    };
});

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: {
            customer: {
                orders: {
                    items: ['order1', 'order2']
                }
            }
        },
        loading: false
    })
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('../../../hooks/useTypePolicies', () => ({
    useTypePolicies: jest.fn()
}));

const log = jest.fn();
const Component = props => {
    const talonProps = useOrderHistoryPage({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = { queries: {} };

describe('it returns the proper shape', () => {
    test('with data', () => {
        createTestInstance(<Component {...props} />);

        const talonProps = log.mock.calls[0][0];
        expect(talonProps).toMatchSnapshot();
    });

    test('while loading without data', () => {
        useQuery.mockReturnValue({
            loading: true
        });

        createTestInstance(<Component {...props} />);

        const talonProps = log.mock.calls[0][0];
        expect(talonProps).toMatchSnapshot();
    });
});

test('syncs background loading state', () => {
    const data = {
        customer: {
            orders: {
                items: ['order1', 'order2']
            }
        }
    };
    useQuery.mockReturnValue({ data, loading: false }).mockReturnValueOnce({
        data,
        loading: true
    });

    const [, { actions }] = useAppContext();
    const { setPageLoading } = actions;

    const root = createTestInstance(<Component {...props} />);
    act(() => {
        root.update(<Component {...props} />);
    });

    expect(setPageLoading).toHaveBeenNthCalledWith(1, true);
    expect(setPageLoading).toHaveBeenNthCalledWith(2, false);
});
