import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';

import SavedPaymentsPage from '../savedPaymentsPage';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock('../../Head', () => ({ Title: () => 'Title' }));
jest.mock(
    '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage',
    () => {
        return {
            useSavedPaymentsPage: jest.fn()
        };
    }
);
jest.mock('../PaymentCard', () => props => <mock-PaymentCard {...props} />);

const props = {};
const talonProps = {
    savedPayments: [
        {
            public_hash: '78asfg87ibafv',
            payment_method_code: 'braintree',
            details: {
                maskedCC: '1234',
                type: 'VI',
                expirationDate: '12/12/2022'
            }
        }
    ]
};

it('renders correctly when there are no existing saved payments', () => {
    // Arrange.
    useSavedPaymentsPage.mockReturnValueOnce({ savedPayments: [] });

    // Act.
    const instance = createTestInstance(<SavedPaymentsPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when there are existing saved payments', () => {
    // Arrange.
    useSavedPaymentsPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<SavedPaymentsPage {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
