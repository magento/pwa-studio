import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from '../paymentMethods';
import Summary from '../summary';
import EditModal from '../editModal';
import PaymentInformation from '../paymentInformation';

jest.mock('../../../../classify');

jest.mock('../paymentMethods', () => () => (
    <div>Payment Methods Component</div>
));

jest.mock('../../PriceAdjustments', () => () => (
    <div>Price Adjustments Component</div>
));

jest.mock('../summary', () => () => <div>Summary Component</div>);

jest.mock('../editModal', () => () => <div>Edit Modal Component</div>);

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation',
    () => ({
        usePaymentInformation: jest.fn().mockReturnValue({
            doneEditing: false,
            handlePaymentError: jest.fn(),
            handlePaymentSuccess: jest.fn(),
            hideEditModal: jest.fn(),
            isEditModalActive: false,
            isLoading: false,
            showEditModal: jest.fn()
        })
    })
);

const defaultTalonResponse = {
    doneEditing: false,
    handlePaymentError: jest.fn(),
    handlePaymentSuccess: jest.fn(),
    hideEditModal: jest.fn(),
    isEditModalActive: false,
    isLoading: false,
    showEditModal: jest.fn()
};

const defaultProps = {
    onSave: jest.fn(),
    resetShouldSubmit: jest.fn(),
    setCheckoutStep: jest.fn(),
    shouldSubmit: false
};

test('Should render summary component only if doneEditing is true', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: true
    });

    const tree = createTestInstance(<PaymentInformation {...defaultProps} />);

    expect(tree.root.findByType(Summary)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: false
    });

    tree.update(<PaymentInformation {...defaultProps} />);

    expect(() => {
        tree.root.findByType(Summary);
    }).toThrow();
});

test('Should render PaymentMethods component only if doneEditing is false', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: false
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.root.findByType(PaymentMethods)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: true
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(PaymentMethods);
    }).toThrow();
});

test('Should render EditModal component only if isEditModalActive is true', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        isEditModalActive: true
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.root.findByType(EditModal)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        isEditModalActive: false
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(EditModal);
    }).toThrow();
});
