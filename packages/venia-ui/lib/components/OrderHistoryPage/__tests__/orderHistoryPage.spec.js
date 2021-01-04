import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import OrderHistoryPage from '../orderHistoryPage';

jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage',
    () => ({
        useOrderHistoryPage: jest
            .fn()
            .mockName('useOrderHistoryPage')
            .mockReturnValue({
                errorMessage: null,
                getOrderDetails: jest.fn().mockName('getOrderDetails'),
                handleKeyPress: jest.fn().mockName('handleKeyPress'),
                isBackgroundLoading: false,
                isLoadingWithoutData: false,
                orders: [],
                resetForm: jest.fn().mockName('resetForm'),
                searchText: ''
            })
    })
);

jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext',
    () => ({
        __esModule: true,
        default: props => (
            <mock-OrderHistoryContextProvider>
                {props.children}
            </mock-OrderHistoryContextProvider>
        )
    })
);

jest.mock('@magento/peregrine/lib/Toasts', () => ({
    useToasts: jest
        .fn()
        .mockName('useToasts')
        .mockReturnValue([
            {},
            {
                addToast: jest.fn().mockName('addToast')
            }
        ])
}));

jest.mock('../../../classify');
jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock('../orderRow', () => 'OrderRow');

const talonProps = {
    errorMessage: null,
    getOrderDetails: jest.fn().mockName('getOrderDetails'),
    handleKeyPress: jest.fn().mockName('handleKeyPress'),
    isBackgroundLoading: false,
    isLoadingWithoutData: false,
    orders: [],
    resetForm: jest.fn().mockName('resetForm'),
    searchText: ''
};

test('renders full page loading indicator', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        isLoadingWithoutData: true,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly without data', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        isLoadingWithoutData: false,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly with data', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        isLoadingWithoutData: false,
        orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders error messages if any', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'Some Error Message'
    });
    const addToast = jest.fn();
    useToasts.mockReturnValueOnce([{}, { addToast }]);

    createTestInstance(<OrderHistoryPage />);

    expect(addToast).toHaveBeenCalled();
    expect(addToast.mock.calls).toMatchSnapshot();
});

test('renders invalid order id message if order id is wrong', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        searchText: '********',
        isBackgroundLoading: false,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders no orders message is orders is empty', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        ...talonProps,
        searchText: null,
        isBackgroundLoading: false,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});
