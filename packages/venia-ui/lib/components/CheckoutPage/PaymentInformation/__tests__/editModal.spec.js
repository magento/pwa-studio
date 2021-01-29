import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import CreditCard from '../creditCard';
import EditModal from '../editModal';

jest.mock('../../../../classify');
jest.mock('../../../Dialog', () => props => (
    <mock-Dialog {...props}>{props.children}</mock-Dialog>
));
jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal',
    () => ({
        useEditModal: jest.fn().mockReturnValue({
            selectedPaymentMethod: 'braintree',
            isLoading: false,
            updateButtonClicked: false,
            handleClose: () => {},
            handleUpdate: () => {},
            handlePaymentSuccess: () => {},
            handleDropinReady: () => {}
        })
    })
);

jest.mock('../creditCard', () => props => <mock-CreditCard {...props} />);

jest.mock('../../../Button', () => {
    return props => <mock-Button {...props} />;
});

jest.mock('../../../Icon', () => {
    return props => <mock-Icon {...props} />;
});

test('Should return correct shape', () => {
    const tree = createTestInstance(<EditModal />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render creditCard component if selectedPaymentMethod is braintree', () => {
    useEditModal.mockReturnValueOnce({
        selectedPaymentMethod: 'braintree',
        isLoading: true,
        updateButtonClicked: false,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    const tree = createTestInstance(<EditModal />);

    expect(tree.root.findByType(CreditCard)).not.toBeNull();
});

test('Should not render creditCard component if selectedPaymentMethod is not braintree', () => {
    useEditModal.mockReturnValueOnce({
        selectedPaymentMethod: 'paypal',
        isLoading: true,
        updateButtonClicked: false,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    const tree = createTestInstance(<EditModal />);

    expect(() => {
        tree.root.findByType(CreditCard);
    }).toThrow();
});
