import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { usePaymentInformation } from '../usePaymentInformation';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('../../../../context/app', () => ({
    useAppContext: jest
        .fn()
        .mockReturnValue([
            {},
            { toggleDrawer: () => {}, closeDrawer: () => {} }
        ])
}));

jest.mock('@apollo/react-hooks', () => {
    return { useQuery: jest.fn() };
});

const Component = props => {
    const talonProps = usePaymentInformation(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { talonProps } = tree.root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return tree.root.findByType('i').props;
    };

    return { talonProps, tree, update };
};

const getSelectedPaymentMethodQuery = 'getSelectedPaymentMethodQuery';
const getPaymentNonceQuery = 'getPaymentNonceQuery';
const queries = {
    getSelectedPaymentMethodQuery,
    getPaymentNonceQuery
};

const getSelectedPaymentMethod = jest.fn().mockReturnValue({
    data: { cart: { selectedPaymentMethod: 'creditCard' } }
});
const getPaymentNonce = jest
    .fn()
    .mockReturnValue({ data: { cart: { paymentNonce: {} } } });

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getSelectedPaymentMethodQuery) {
            return getSelectedPaymentMethod();
        } else if (query === getPaymentNonceQuery) {
            return getPaymentNonce();
        } else {
            return { data: {} };
        }
    });
});

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({ queries });

    expect(talonProps).toMatchSnapshot();
});

test('doneEditing should be true if paymentNonce is a truthy value, if not false', () => {
    getPaymentNonce.mockReturnValueOnce({
        data: { cart: { paymentNonce: null } }
    });

    const { talonProps, update } = getTalonProps({ queries });

    expect(talonProps.doneEditing).toBeFalsy();

    getPaymentNonce.mockReturnValueOnce({
        data: {
            cart: {
                paymentNonce: {
                    nonce: 'xxxxxxxxxx'
                }
            }
        }
    });

    const { talonProps: newTalonProps } = update();

    expect(newTalonProps.doneEditing).toBeTruthy();
});

test('shouldRequestPaymentNonce should be set to true when handleReviewOrder is called', () => {
    const onSave = jest.fn();
    const { talonProps, update } = getTalonProps({ queries, onSave });

    expect(talonProps.shouldRequestPaymentNonce).toBeFalsy();
    expect(onSave).not.toHaveBeenCalled();

    talonProps.handleReviewOrder();

    const { talonProps: newTalonProps } = update();

    expect(newTalonProps.shouldRequestPaymentNonce).toBeTruthy();
    expect(onSave).toHaveBeenCalled();
});

test('hideEditModal and showEditModal functions should toggle isEditModalHidden flag', () => {
    const { talonProps, update } = getTalonProps({ queries });

    expect(talonProps.isEditModalHidden).toBeTruthy();

    talonProps.showEditModal();

    const { talonProps: step1Props } = update();

    expect(step1Props.isEditModalHidden).toBeFalsy();

    talonProps.hideEditModal();

    const { talonProps: step2Props } = update();

    expect(step2Props.isEditModalHidden).toBeTruthy();
});

test('selectedPaymentMethod should be the value from cache', () => {
    getSelectedPaymentMethod.mockReturnValueOnce({
        data: { cart: { selectedPaymentMethod: 'creditCard' } }
    });

    const { talonProps, update } = getTalonProps({ queries });

    expect(talonProps.selectedPaymentMethod).toBe('creditCard');

    getSelectedPaymentMethod.mockReturnValueOnce({
        data: { cart: { selectedPaymentMethod: 'paypal' } }
    });

    const { talonProps: newTalonProps } = update();

    expect(newTalonProps.selectedPaymentMethod).toBe('paypal');
});

test('paymentNonce should be the value from cache', () => {
    getPaymentNonce.mockReturnValueOnce({
        data: { cart: { paymentNonce: 'xxxxx' } }
    });

    const { talonProps, update } = getTalonProps({ queries });

    expect(talonProps.paymentNonce).toBe('xxxxx');

    getPaymentNonce.mockReturnValueOnce({
        data: { cart: { paymentNonce: '+++++' } }
    });

    const { talonProps: newTalonProps } = update();

    expect(newTalonProps.paymentNonce).toBe('+++++');
});
