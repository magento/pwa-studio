import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';

import PaymentMethods from '../paymentMethods';
import Summary from '../summary';
import EditModal from '../editModal';
import PaymentInformation from '../paymentInformation';

jest.mock('../../../../classify');

jest.mock('../../PriceAdjustments', () => props => (
    <mock-PriceAdjustments {...props} />
));

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

jest.mock('../summary', () => props => <mock-Summary {...props} />);
jest.mock('../editModal', () => props => <mock-EditModal {...props} />);
jest.mock('../paymentMethods', () => props => (
    <mock-PaymentMethods {...props} />
));

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

test('Should render loading state', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        isLoading: true
    });

    const tree = createTestInstance(<PaymentInformation {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render summary component only if doneEditing is true', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: true
    });

    const tree = createTestInstance(<PaymentInformation {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();

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
    expect(tree.toJSON()).toMatchSnapshot();

    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: true
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(PaymentMethods);
    }).toThrow();
});

test('Should render EditModal component only if doneEditing is true', () => {
    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: true
    });

    const tree = createTestInstance(<PaymentInformation />);

    expect(tree.toJSON()).toMatchSnapshot();
    // TODO: If we can figure out how to render Lazy components, swap the above
    // snap for this assertion.
    // expect(tree.root.findByType(EditModal)).not.toBeNull();

    usePaymentInformation.mockReturnValueOnce({
        ...defaultTalonResponse,
        doneEditing: false
    });

    tree.update(<PaymentInformation />);

    expect(() => {
        tree.root.findByType(EditModal);
    }).toThrow();
});
