import React from 'react';

import createTestInstance from '../../../../util/createTestInstance';
import { useEditModal } from '../useEditModal';

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

test('Snapshot test', () => {
    const { talonProps } = getTalonProps({ onClose: () => {} });

    expect(talonProps).toMatchSnapshot();
});

test('Should call onClose when handleClose is called', () => {
    const onClose = jest.fn();

    const { talonProps } = getTalonProps({ onClose });
    const { handleClose } = talonProps;

    handleClose();

    expect(onClose).toHaveBeenCalled();
});

test('Should call onClose when handlePaymentSuccess is called', () => {
    const onClose = jest.fn();

    const { talonProps } = getTalonProps({ onClose });
    const { handlePaymentSuccess } = talonProps;

    handlePaymentSuccess();

    expect(onClose).toHaveBeenCalled();
});

test('Should set shouldRequestPaymentNonce to true when handleUpdate is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handleUpdate();

    expect(
        tree.root.findByType('i').props.talonProps.shouldRequestPaymentNonce
    ).toBeTruthy();
});

test('Should set isLoading to false when handleDropinReady is called', () => {
    const { talonProps, tree } = getTalonProps({
        onClose: () => {}
    });

    talonProps.handleDropinReady();

    expect(tree.root.findByType('i').props.talonProps.isLoading).toBeFalsy();
});
