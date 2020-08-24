import React, { useEffect, useState } from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useMutation } from '@apollo/client';

import { useProduct } from '../useProduct';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});

jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');

    const spy = jest.spyOn(ApolloClient, 'useMutation');
    spy.mockImplementation(() => [
        jest.fn(),
        {
            data: {},
            loading: false,
            error: null
        }
    ]);

    return {
        ApolloClient,
        useMutation: spy
    };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
        drawer: null
    };
    const api = { toggleDrawer: jest.fn() };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const props = {
    item: {
        prices: {
            price: {
                value: 99,
                currency: 'USD'
            }
        },
        product: {
            name: 'unit test',
            small_image: {
                url: 'test.webp'
            }
        },
        quantity: 7
    },
    mutations: {
        removeItemMutation: '',
        updateItemQuantityMutation: ''
    },
    setActiveEditItem: jest.fn(),
    setIsCartUpdating: jest.fn()
};

const log = jest.fn();
const Component = props => {
    const talonProps = useProduct({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i talonProps={talonProps} />;
};

test('it returns the proper shape', () => {
    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([jest.fn(), {}]);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        errorMessage: '',
        handleEditItem: expect.any(Function),
        handleRemoveFromCart: expect.any(Function),
        handleToggleFavorites: expect.any(Function),
        handleUpdateItemQuantity: expect.any(Function),
        isEditable: expect.any(Boolean),
        isFavorite: expect.any(Boolean),
        product: expect.any(Object)
    });
});

test('it returns the correct error message when the error is not graphql', async () => {
    expect.assertions(1);

    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([
        jest.fn().mockRejectedValue(new Error('nope')),
        { error: new Error('test!') }
    ]);

    useState.mockReturnValueOnce([false, jest.fn()]);
    useState.mockReturnValueOnce([true, jest.fn()]);

    // Act.
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toBe('test!');
});

test('it returns the correct error message when the error is graphql', () => {
    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            error: {
                graphQLErrors: [new Error('test a'), new Error('test b')]
            }
        }
    ]);

    useState.mockReturnValueOnce([false, jest.fn()]);
    useState.mockReturnValueOnce([true, jest.fn()]);

    // Act.
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    // Assert.
    expect(talonProps.errorMessage).toBe('test a, test b');
});

test('it resets cart updating flag on unmount', () => {
    const setIsCartUpdating = jest.fn();

    const tree = createTestInstance(
        <Component {...props} setIsCartUpdating={setIsCartUpdating} />
    );

    expect(setIsCartUpdating).not.toBeCalled();

    tree.unmount();

    expect(setIsCartUpdating).toHaveBeenCalledWith(false);
});
