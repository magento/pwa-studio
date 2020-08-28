import React from 'react';
import { useMutation } from '@apollo/client';

import createTestInstance from '../../../../../util/createTestInstance';
import { useShippingForm } from '../useShippingForm';

jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn(),
    useMutation: jest.fn().mockReturnValue([
        jest.fn(),
        {
            called: false,
            error: undefined,
            loading: false
        }
    ])
}));

jest.mock('../../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useShippingForm(props);
    return <i talonProps={talonProps} />;
};

const props = {
    selectedValues: {},
    setIsCartUpdating: jest.fn(),
    mutations: {},
    queries: {}
};

test('returns correct shape', () => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns errors and loading state from Apollo', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            error: 'Apollo Error',
            loading: true
        }
    ]);

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
