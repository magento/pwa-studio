import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useMutation } from '@apollo/react-hooks';

import { useProduct } from '../useProduct';

jest.mock('@apollo/react-hooks', () => {
    const ApolloReactHooks = jest.requireActual('@apollo/react-hooks');

    const spy = jest.spyOn(ApolloReactHooks, 'useMutation');
    spy.mockImplementation(() => [
        jest.fn(),
        {
            data: {},
            loading: false,
            error: null
        }
    ]);

    return {
        ApolloReactHooks,
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

    return null;
};

test('it returns the proper shape', () => {
    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([jest.fn(), {}]);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleEditItem: expect.any(Function),
        handleRemoveFromCart: expect.any(Function),
        handleToggleFavorites: expect.any(Function),
        handleUpdateItemQuantity: expect.any(Function),
        isEditable: expect.any(Boolean),
        isFavorite: expect.any(Boolean),
        product: expect.any(Object),
        updateItemErrorMessage: null
    });
});

test('it returns the correct error message when the error is not graphql', () => {
    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: { message: 'test!' } }
    ]);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
            updateItemErrorMessage: 'test!'
        })
    );
});

test('it returns the correct error message when the error is graphql', () => {
    // Arrange.
    useMutation.mockReturnValueOnce([jest.fn(), {}]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            error: {
                graphQLErrors: [{ message: 'test a' }, { message: 'test b' }]
            }
        }
    ]);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
            updateItemErrorMessage: 'test a, test b'
        })
    );
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
