import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { useFormApi, useFieldState } from 'informed';

import { usePaymentMethods } from '../usePaymentMethods';
import createTestInstance from '../../../../util/createTestInstance';

const setValue = jest.fn();
const writeQuery = jest.fn();

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: {
            cart: {
                selectedPaymentMethod: ''
            }
        }
    }),
    useApolloClient: jest.fn().mockReturnValue({
        writeQuery: () => {}
    })
}));

jest.mock('informed', () => ({
    useFieldState: jest.fn().mockReturnValue({
        value: ''
    }),
    useFormApi: jest.fn().mockReturnValue({
        setValue: () => {}
    })
}));

const Component = props => {
    const talonProps = usePaymentMethods(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return talonProps;
    };

    return { talonProps, tree, update };
};

beforeAll(() => {
    useFormApi.mockReturnValue({
        setValue
    });
    useApolloClient.mockReturnValue({
        writeQuery
    });
});

test('Snapshot test', () => {
    const { talonProps } = getTalonProps({
        operations: { queries: {} }
    });

    expect(talonProps).toMatchSnapshot();
});

test('If current selection is null but there is a value in cache, restore UI with that value', () => {
    useFieldState.mockReturnValue({
        value: null
    });

    useQuery.mockReturnValue({
        data: {
            cart: {
                selectedPaymentMethod: 'creditCard'
            }
        }
    });

    getTalonProps({
        operations: { queries: {} }
    });

    expect(setValue).toHaveBeenCalledWith(
        'selectedPaymentMethod',
        'creditCard'
    );
});

test('If current selection is not null and different from the selection from cache, it should be updated in cache', () => {
    useFieldState.mockReturnValue({
        value: 'paypal'
    });

    useQuery.mockReturnValue({
        data: {
            cart: {
                selectedPaymentMethod: 'creditCard'
            }
        }
    });

    getTalonProps({
        operations: { queries: {} }
    });

    const savedSelectedPaymentMethod =
        writeQuery.mock.calls[0][0].data.cart.selectedPaymentMethod;

    expect(savedSelectedPaymentMethod).toBe('paypal');
});
