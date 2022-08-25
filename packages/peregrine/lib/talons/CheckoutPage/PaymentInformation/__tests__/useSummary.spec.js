import React from 'react';

import { useQuery } from '@apollo/client';

import { useSummary } from '../useSummary';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('@apollo/client', () => ({
    ...jest.requireActual('@apollo/client'),
    useQuery: jest.fn().mockReturnValueOnce({
        loading: false,
        data: {
            cart: {
                selected_payment_method: 'braintree'
            }
        }
    })
}));

const Component = props => {
    const talonProps = useSummary(props);

    return <i talonProps={talonProps} />;
};

test('Should return correct shape', () => {
    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('handles empty summary data returned from query', () => {
    useQuery.mockReturnValueOnce({
        loading: false
    });

    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.selectedPaymentMethod).toBeNull();
});
