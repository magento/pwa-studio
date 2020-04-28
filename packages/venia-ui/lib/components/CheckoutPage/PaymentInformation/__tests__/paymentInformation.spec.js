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
            handleReviewOrder: () => {},
            shouldRequestPaymentNonce: false,
            paymentNonce: {},
            currentSelectedPaymentMethod: 'braintree',
            isEditModalHidden: false,
            showEditModal: () => {},
            hideEditModal: () => {}
        })
    })
);

const usePaymentInformationMockReturn = {
    doneEditing: false,
    handleReviewOrder: () => {},
    shouldRequestPaymentNonce: false,
    paymentNonce: {},
    currentSelectedPaymentMethod: 'braintree',
    isEditModalHidden: false,
    showEditModal: () => {},
    hideEditModal: () => {},
    reviewOrderButtonClicked: false,
    resetReviewOrderButtonClicked: () => {}
};

test('Should return correct shape', () => {
    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render summary component only if doneEditing is true', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        doneEditing: true
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.root.findByType(Summary)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        doneEditing: false
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(Summary);
    }).toThrow();
});

test('Should render PaymentMethods component only if doneEditing is false', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        doneEditing: false
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.root.findByType(PaymentMethods)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        doneEditing: true
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(PaymentMethods);
    }).toThrow();
});

test('Should render EditModal component only if isEditModalHidden is false', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        isEditModalHidden: false
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.root.findByType(EditModal)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...usePaymentInformationMockReturn,
        isEditModalHidden: true
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(EditModal);
    }).toThrow();
});
