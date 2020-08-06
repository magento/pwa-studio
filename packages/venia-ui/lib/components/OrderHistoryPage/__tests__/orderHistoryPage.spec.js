import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import OrderHistoryPage from '../orderHistoryPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage',
    () => {
        return {
            useOrderHistoryPage: jest.fn()
        };
    }
);

const props = {};
const talonProps = {
    data: null,
    isLoading: false
};

it('renders a loading indicator while loading', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        isLoading: true
    };
    useOrderHistoryPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const tree = createTestInstance(<OrderHistoryPage {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

it('renders correctly with no data', () => {
    // Arrange.
    useOrderHistoryPage.mockReturnValueOnce(talonProps);

    // Act.
    const tree = createTestInstance(<OrderHistoryPage {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

it('renders correctly with data', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        data: {}
    };
    useOrderHistoryPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const tree = createTestInstance(<OrderHistoryPage {...props} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
