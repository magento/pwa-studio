import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import OrderHistoryPage from '../orderHistoryPage';

jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage',
    () => ({
        useOrderHistoryPage: jest.fn()
    })
);

jest.mock('../../../classify');
jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock('../orderRow', () => 'OrderRow');

test('renders full page loading indicator', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        isLoadingWithoutData: true,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly without data', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        isLoadingWithoutData: false,
        orders: []
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly with data', () => {
    useOrderHistoryPage.mockReturnValueOnce({
        isLoadingWithoutData: false,
        orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });

    const tree = createTestInstance(<OrderHistoryPage />);

    expect(tree.toJSON()).toMatchSnapshot();
});
