import React from 'react';

import { usePaymentInformation } from '../usePaymentInformation';
import createTestInstance from '../../../../util/createTestInstance';
import { useAppContext } from '../../../../context/app';

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

jest.mock('informed', () => {
    return {
        useFieldState: jest.fn().mockReturnValue({ value: 'braintree' })
    };
});

const getPaymentDetailsQuery = 'getPaymentDetailsQuery';
const queries = {
    getPaymentDetailsQuery
};

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
    const { talonProps } = getTalonProps({ queries });

    expect(talonProps).toMatchSnapshot();
});

test('hideEditModal should call closeDrawer from app context', () => {
    const closeDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { toggleDrawer: () => {}, closeDrawer }
    ]);

    const { talonProps } = getTalonProps({ queries });

    talonProps.hideEditModal();

    expect(closeDrawer).toHaveBeenCalledWith('edit.payment');
});

test('showEditModal should call toggleDrawer from app context', () => {
    const toggleDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { closeDrawer: () => {}, toggleDrawer }
    ]);

    const { talonProps } = getTalonProps({ queries });

    talonProps.showEditModal();

    expect(toggleDrawer).toHaveBeenCalledWith('edit.payment');
});
