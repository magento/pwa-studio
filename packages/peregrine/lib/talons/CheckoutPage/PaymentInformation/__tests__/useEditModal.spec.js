import React from 'react';

import createTestInstance from '../../../../util/createTestInstance';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { useEditModal } from '../useEditModal';

import { useQuery } from '@apollo/client';

jest.mock('@apollo/client', () => {
    return {
        useQuery: jest.fn().mockReturnValue({
            data: {
                cart: {
                    selected_payment_method: { code: 'braintree' }
                }
            }
        })
    };
});

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('../editModal.gql.js', () => ({
    getSelectedPaymentMethodQuery: 'getSelectedPaymentMethodQuery'
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useEditModal(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...newProps} />);

        return talonProps;
    };

    return { talonProps, tree, update };
};

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({
        onClose: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});

test('Should call onClose when handleClose is called', () => {
    const onClose = jest.fn();

    const { talonProps } = getTalonProps({
        onClose
    });
    const { handleClose } = talonProps;

    handleClose();

    expect(onClose).toHaveBeenCalled();
});

test('Should call onClose when handlePaymentSuccess is called', () => {
    const onClose = jest.fn();

    const { talonProps } = getTalonProps({
        onClose
    });
    const { handlePaymentSuccess } = talonProps;

    handlePaymentSuccess();

    expect(onClose).toHaveBeenCalled();
});

test('Should set updateButtonClicked to true when handleUpdate is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handleUpdate();

    expect(
        tree.root.findByType('i').props.talonProps.updateButtonClicked
    ).toBeTruthy();
});

test('Should set isLoading to false when handlePaymentReady is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handlePaymentReady();

    expect(tree.root.findByType('i').props.talonProps.isLoading).toBeFalsy();
});

test('Should reset updateButtonClicked state when handlePaymentError() is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handleUpdate();

    expect(
        tree.root.findByType('i').props.talonProps.updateButtonClicked
    ).toBeTruthy();

    talonProps.handlePaymentError();

    expect(
        tree.root.findByType('i').props.talonProps.updateButtonClicked
    ).toBeFalsy();
});

test('Should reset updateButtonClicked state when resetUpdatedButtonClicked() is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handleUpdate();

    expect(
        tree.root.findByType('i').props.talonProps.updateButtonClicked
    ).toBeTruthy();

    talonProps.resetUpdateButtonClicked();

    expect(
        tree.root.findByType('i').props.talonProps.updateButtonClicked
    ).toBeFalsy();
});

test('Should return null selectedPaymentMethod when fetched data does not return any', () => {
    useQuery.mockReturnValueOnce({});
    const { talonProps } = getTalonProps({
        onClose: () => {}
    });

    expect(talonProps.selectedPaymentMethod).toBeFalsy();
});

test('Should dispatch event when handlePaymentSuccess is called', async () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    const { talonProps } = getTalonProps({
        onClose: () => {}
    });
    const { handlePaymentSuccess } = talonProps;

    handlePaymentSuccess();

    expect(mockDispatchEvent).toBeCalledTimes(1);
    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});
