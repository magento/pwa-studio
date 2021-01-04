import React from 'react';
import { act } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import { useFormState, useFormApi } from 'informed';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderHistoryPage } from '../useOrderHistoryPage';
import { useAppContext } from '../../../context/app';

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => ({ push: jest.fn() }))
    };
});

jest.mock('informed', () => ({
    useFormState: jest.fn().mockReturnValue({
        values: {
            search: null
        }
    }),
    useFormApi: jest.fn().mockReturnValue({
        reset: jest.fn()
    })
}));

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useLazyQuery: jest.fn().mockReturnValue([jest.fn(), {}])
    };
});

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

jest.mock('../../../util/deriveErrorMessage', () => ({
    deriveErrorMessage: jest.fn().mockReturnValue(null)
}));

const getOrder = jest.fn().mockName('getOrder');
const getOrderQueryReturnValue = jest.fn().mockReturnValue([
    getOrder,
    {
        error: null,
        loading: false
    }
]);

beforeEach(() => {
    useLazyQuery.mockImplementation(query => {
        if (query === 'getCustomerOrderQuery') {
            return getOrderQueryReturnValue();
        } else {
            return [jest.fn(), {}];
        }
    });
});

const props = {
    operations: {
        getCustomerOrdersQuery: 'getCustomerOrdersQuery',
        getCustomerOrderQuery: 'getCustomerOrderQuery'
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
        const { talonProps } = getTalonProps(props);

        expect(talonProps).toMatchSnapshot();
    });

    test('while loading without data', () => {
        getOrderQueryReturnValue.mockReturnValueOnce([
            getOrder,
            {
                error: null,
                loading: true
            }
        ]);

        const { talonProps } = getTalonProps(props);

        expect(talonProps).toMatchSnapshot();
    });
});

test('syncs background loading state', () => {
    getOrderQueryReturnValue.mockReturnValueOnce([
        getOrder,
        {
            error: null,
            loading: true
        }
    ]);

    const [, { actions }] = useAppContext();
    const { setPageLoading } = actions;

    const { update } = getTalonProps(props);
    update();

    expect(setPageLoading).toHaveBeenNthCalledWith(1, true);
    expect(setPageLoading).toHaveBeenNthCalledWith(2, false);
});

test('getOrderDetails fetches order details for the given search text', () => {
    useFormState.mockReturnValueOnce({ values: { search: '*****' } });

    const { talonProps, update } = getTalonProps(props);
    talonProps.getOrderDetails();
    update();

    expect(getOrder).toHaveBeenCalled();
    expect(getOrder.mock.calls[1]).toMatchSnapshot();
});

test('handleKeyPress should fetch orders if Enter key is pressed', () => {
    useFormState.mockReturnValueOnce({ values: { search: '*****' } });

    const { talonProps, update } = getTalonProps(props);
    talonProps.handleKeyPress({ key: 'Enter' });
    update();

    expect(getOrder).toHaveBeenCalled();
    expect(getOrder.mock.calls[1]).toMatchSnapshot();
});

test('resetForm should clear search and refetch orders data', () => {
    const stopPropagation = jest.fn();
    const reset = jest.fn();

    useFormApi.mockReturnValueOnce({ reset });

    const { talonProps, update } = getTalonProps(props);
    talonProps.resetForm({
        stopPropagation
    });
    update();

    expect(stopPropagation).toHaveBeenCalled();
    expect(reset).toHaveBeenCalled();
    // should fetch all orders
    expect(getOrder).toHaveBeenCalled();
    expect(getOrder.mock.calls[1]).toMatchSnapshot();
});
