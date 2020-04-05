import React from 'react';
import ReactDOM from 'react-dom';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import Button from '../../../Button';
import CreditCardPaymentInformation from '../creditCardPaymentMethod';
import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal',
    () => ({
        useEditModal: jest.fn().mockReturnValue({
            isLoading: false,
            shouldRequestPaymentNonce: false,
            handleClose: () => {},
            handleUpdate: () => {},
            handlePaymentSuccess: () => {},
            handleDropinReady: () => {}
        })
    })
);

jest.mock('../creditCardPaymentMethod', () => () => (
    <div>Credit Card Payment Method</div>
));

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

test('Snapshot test', () => {
    const tree = createTestInstance(
        <EditModal selectedPaymentMethod="creditCard" />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render creditCardPaymentInformation component if selectedPaymentMethod is creditCard', () => {
    const tree = createTestInstance(
        <EditModal selectedPaymentMethod="creditCard" />
    );

    expect(tree.root.findByType(CreditCardPaymentInformation)).not.toBeNull();
});

test('Should not render creditCardPaymentInformation component if selectedPaymentMethod is not creditCard', () => {
    const tree = createTestInstance(
        <EditModal selectedPaymentMethod="paypal" />
    );

    expect(() => {
        tree.root.findByType(CreditCardPaymentInformation);
    }).toThrow();
});

test('Should render Cancel and Update buttons only if isLoading is false', () => {
    useEditModal.mockReturnValueOnce({
        isLoading: true,
        shouldRequestPaymentNonce: false,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    const tree = createTestInstance(
        <EditModal selectedPaymentMethod="creditCard" />
    );

    expect(() => {
        tree.root.findByType(Button);
    }).toThrow();

    useEditModal.mockReturnValueOnce({
        isLoading: false,
        shouldRequestPaymentNonce: false,
        handleClose: () => {},
        handleUpdate: () => {},
        handlePaymentSuccess: () => {},
        handleDropinReady: () => {}
    });

    tree.update(<EditModal selectedPaymentMethod="creditCard" />);

    expect(tree.root.findAllByType(Button)).toHaveLength(2);
});
