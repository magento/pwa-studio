import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';

import SavedPaymentsPage from '../SavedPaymentsPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock('../../Icon', () => 'Icon');
jest.mock(
    '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage',
    () => {
        return {
            useSavedPaymentsPage: jest.fn()
        };
    }
);

const props = {};
const talonProps = {
    savedPayments: [],
    handleAddPayment: jest.fn().mockName('handleAddPayment')
};

it('renders correctly when there are no existing saved payments', () => {
    // Arrange.
    useSavedPaymentsPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<SavedPaymentsPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when there are existing saved payments', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        savedPayments: ['a', 'b', 'c']
    };
    useSavedPaymentsPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<SavedPaymentsPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
