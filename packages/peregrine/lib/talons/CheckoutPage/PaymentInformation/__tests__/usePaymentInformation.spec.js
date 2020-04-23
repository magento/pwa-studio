import React from 'react';

import { usePaymentInformation } from '../usePaymentInformation';
import createTestInstance from '../../../../util/createTestInstance';
import { useAppContext } from '../../../../context/app';

jest.mock('../../../../context/app', () => ({
    useAppContext: jest
        .fn()
        .mockReturnValue([
            {},
            { toggleDrawer: () => {}, closeDrawer: () => {} }
        ])
}));

jest.mock('informed', () => {
    return {
        useFieldState: jest.fn().mockReturnValue({ value: 'braintree' })
    };
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

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({});

    expect(talonProps).toMatchSnapshot();
});

test('onSave should be called when handlePaymentSuccess is called', () => {
    const onSave = jest.fn();
    const { talonProps, update } = getTalonProps({ onSave });

    expect(onSave).not.toHaveBeenCalled();

    talonProps.handlePaymentSuccess();

    update();

    expect(onSave).toHaveBeenCalled();
});

test('hideEditModal should call closeDrawer from app context', () => {
    const closeDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { toggleDrawer: () => {}, closeDrawer }
    ]);

    const { talonProps } = getTalonProps({});

    talonProps.hideEditModal();

    expect(closeDrawer).toHaveBeenCalledWith('edit.payment');
});

test('showEditModal should call toggleDrawer from app context', () => {
    const toggleDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { closeDrawer: () => {}, toggleDrawer }
    ]);

    const { talonProps } = getTalonProps({});

    talonProps.showEditModal();

    expect(toggleDrawer).toHaveBeenCalledWith('edit.payment');
});
