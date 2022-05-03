import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';
import { useCreditCard } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useCreditCard';

import CreditCard from '../creditCard';

jest.mock('@magento/peregrine/lib/talons/SavedPaymentsPage/useCreditCard');
jest.mock('@magento/venia-ui/lib/classify');

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [{}, {}]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

const props = {
    details: {
        maskedCC: '1234',
        type: 'VI',
        expirationDate: '12/12/2022'
    },
    public_hash: 'test_123'
};

const talonProps = {
    handleDeletePayment: jest.fn().mockName('handleDeletePayment'),
    hasError: false,
    isConfirmingDelete: false,
    isDeletingPayment: false,
    toggleDeleteConfirmation: jest.fn().mockName('toggleDeleteConfirmation')
};

test('should render properly', () => {
    useCreditCard.mockReturnValue(talonProps);
    const tree = createTestInstance(<CreditCard {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should pop a toast on error', () => {
    const addToast = jest.fn();
    useToasts.mockReturnValue([{}, { addToast }]);
    useCreditCard.mockReturnValue({
        ...talonProps,
        hasError: true
    });
    createTestInstance(<CreditCard {...props} />);

    expect(addToast.mock.calls[0][0]).toMatchSnapshot();
});

test('renders delete confirmation', () => {
    useCreditCard.mockReturnValue({
        ...talonProps,
        isConfirmingDelete: true,
        isDeletingPayment: true
    });

    const tree = createTestInstance(<CreditCard {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
