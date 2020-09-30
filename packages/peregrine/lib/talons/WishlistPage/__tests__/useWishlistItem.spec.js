import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlistItem } from '../useWishlistItem';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([jest.fn(), { loading: false }])
}));

jest.mock('../../../context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useWishlistItem({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const baseProps = {
    mutations: {},
    sku: 'shoggoth-shirt'
};

test('it returns the correct shape', () => {
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('it returns mutation response fields', () => {
    useMutation.mockReturnValue([jest.fn(), { error: {}, loading: true }]);
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps.hasError).toBe(true);
    expect(talonProps.isLoading).toBe(true);
});

test('mutation passes options for simple item', () => {
    createTestInstance(<Component {...baseProps} />);

    const mutationOptions = useMutation.mock.calls[0][1];

    expect(mutationOptions).toMatchSnapshot();
});

test('mutation passes options for configurable item', () => {
    const configurableProps = {
        ...baseProps,
        childSku: 'shoggoth-shirt-xl-black'
    };
    createTestInstance(<Component {...configurableProps} />);

    const mutationOptions = useMutation.mock.calls[0][1];

    expect(mutationOptions).toMatchSnapshot();
});

test('handleAddToCart callback fires mutation', () => {
    const mockMutate = jest.fn();
    useMutation.mockReturnValue([mockMutate, { loading: false }]);
    createTestInstance(<Component {...baseProps} />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleAddToCart();
    });

    expect(mockMutate).toHaveBeenCalled();
});
