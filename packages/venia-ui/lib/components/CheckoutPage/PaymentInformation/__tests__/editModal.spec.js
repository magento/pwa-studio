import React from 'react';
import ReactDOM from 'react-dom';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import Button from '../../../Button';
import CreditCard from '../creditCard';
import EditModal from '../editModal';

jest.mock('../../../../classify');

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

jest.mock('../creditCard', () => () => <div>Credit Card Payment Method</div>);

jest.mock('../../../Button', () => {
    return () => <div>Button Component</div>;
});

jest.mock('../../../Icon', () => {
    return () => <div>Icon Component</div>;
});

beforeAll(() => {
    /**
     * Mocking ReactDOM.createPortal because of incompatabilities
     * between ReactDOM and react-test-renderer.
     *
     * More info: https://github.com/facebook/react/issues/11565
     */
    ReactDOM.createPortal = jest.fn(element => {
        return element;
    });
});

afterAll(() => {
    ReactDOM.createPortal.mockClear();
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

test('Should render Cancel and Update buttons only if isLoading is false', () => {
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

    expect(() => {
        tree.root.findByType(Button);
    }).toThrow();

    useEditModal.mockReturnValueOnce({
        selectedPaymentMethod: 'braintree',
        isLoading: false,
        updateButtonClicked: false,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    tree.update(<EditModal />);

    expect(tree.root.findAllByType(Button)).toHaveLength(2);
});

test('Actions buttons should be disabled if updateButtonClicked is true', () => {
    useEditModal.mockReturnValueOnce({
        selectedPaymentMethod: 'braintree',
        isLoading: false,
        updateButtonClicked: true,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    const tree = createTestInstance(<EditModal />);

    expect(
        tree.root.findAllByType(Button).map(({ props }) => props.disabled)
    ).toMatchObject([true, true]);
});
