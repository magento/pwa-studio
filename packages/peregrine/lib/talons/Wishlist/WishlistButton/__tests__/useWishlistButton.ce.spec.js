import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useWishlistButton } from '../useWishlistButton.ce';

import defaultOperations from '../wishlistButton.gql';

const initialProps = {
    itemOptions: {
        sku: 'MyProductSku',
        quantity: 1
    }
};

const addProductToWishlistMock = {
    request: {
        query: defaultOperations.addProductToWishlistMutation,
        variables: {
            wishlistId: '0',
            itemOptions: initialProps.itemOptions
        }
    },
    result: {
        data: {
            addProductsToWishlist: {
                user_errors: []
            }
        }
    }
};
const addProductToWishlistErrorMock = {
    request: {
        query: defaultOperations.addProductToWishlistMutation,
        variables: {
            wishlistId: '0',
            itemOptions: initialProps.itemOptions
        }
    },
    result: {
        data: {
            addProductsToWishlist: {
                user_errors: []
            }
        }
    },
    error: new Error('Oopsie!')
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [addProductToWishlistMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useWishlistButton, { wrapper, ...renderHookOptions });
};

test('returns correct shape', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "addProductError": undefined,
          "handleClick": [Function],
          "isDisabled": false,
          "isItemAdded": false,
        }
    `);
});

test('sets isItemAdded and isDisabled to `false` if the item options change', async () => {
    const { result, rerender } = renderHookWithProviders();

    await act(async () => await result.current.handleClick());

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "addProductError": undefined,
          "handleClick": [Function],
          "isDisabled": true,
          "isItemAdded": true,
        }
    `);

    rerender({
        itemOptions: {
            ...initialProps.itemOptions,
            selected_options: ['foo']
        }
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "addProductError": undefined,
          "handleClick": [Function],
          "isDisabled": false,
          "isItemAdded": false,
        }
    `);
});

test('returns the error from the mutation', async () => {
    const { result } = renderHookWithProviders({
        mocks: [addProductToWishlistErrorMock]
    });

    await act(async () => await result.current.handleClick());

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "addProductError": [Error: Oopsie!],
          "handleClick": [Function],
          "isDisabled": false,
          "isItemAdded": false,
        }
    `);
});
