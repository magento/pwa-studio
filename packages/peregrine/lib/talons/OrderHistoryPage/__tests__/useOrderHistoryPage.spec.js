import React from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useOrderHistoryPage } from '../useOrderHistoryPage';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useQuery: jest.fn().mockReturnValue({})
    };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/util/deriveErrorMessage', () => ({
    deriveErrorMessage: jest.fn().mockReturnValue(null)
}));

const props = {
    operations: {
        getCustomerOrdersQuery: 'getCustomerOrdersQuery'
    }
};

const orderResponse = {
    customer: {
        orders: {
            items: ['order1', 'order2'],
            page_info: {
                current_page: 1,
                total_pages: 2
            },
            total_count: 4
        }
    }
};

const Component = props => {
    const talonProps = useOrderHistoryPage(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

describe('it returns the proper shape', () => {
    test('with data', () => {
        useQuery.mockReturnValue({ data: orderResponse, loading: false });
        const { talonProps } = getTalonProps(props);

        expect(talonProps).toMatchSnapshot();
    });

    test('while loading without data', () => {
        useQuery.mockReturnValueOnce({
            error: null,
            loading: true
        });

        const { talonProps } = getTalonProps(props);

        expect(talonProps).toMatchSnapshot();
    });
});

test('syncs background loading state', () => {
    useQuery.mockReturnValueOnce({
        data: orderResponse,
        error: null,
        loading: true
    });

    const [, { actions }] = useAppContext();
    const { setPageLoading } = actions;

    const { update } = getTalonProps(props);
    update();

    expect(setPageLoading).toHaveBeenNthCalledWith(1, true);
    expect(setPageLoading).toHaveBeenNthCalledWith(2, false);
});

test('submit and reset handlers modify search text', () => {
    const { talonProps: initialTalonProps, update } = getTalonProps(props);
    initialTalonProps.handleSubmit({
        search: '000123'
    });

    const step1TalonProps = update();
    step1TalonProps.handleReset();

    const step2TalonProps = update();

    expect(initialTalonProps.searchText).toBe('');
    expect(step1TalonProps.searchText).toBe('000123');
    expect(useQuery.mock.calls[1][1].variables.filter.number.match).toBe(
        '000123'
    );
    expect(step2TalonProps.searchText).toBe('');
});

test('load more orders increases page size argument of query', () => {
    useQuery.mockReturnValue({
        data: {
            customer: {
                orders: {
                    items: [],
                    page_info: {
                        current_page: 1,
                        total_pages: 2
                    },
                    total_count: 15
                }
            }
        }
    });

    const { talonProps, update } = getTalonProps();
    talonProps.loadMoreOrders();
    update();

    expect(useQuery.mock.calls[0][1].variables.pageSize).toBe(10);
    expect(useQuery.mock.calls[1][1].variables.pageSize).toBe(20);
});
