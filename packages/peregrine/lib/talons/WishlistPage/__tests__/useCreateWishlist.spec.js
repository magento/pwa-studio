import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';
import { InMemoryCache } from '@apollo/client';

import { useCreateWishlist } from '../useCreateWishlist';
import defaultOperations from '../createWishlist.gql';

const createWishlistVariables = {
    name: 'Test WishList',
    visibility: 'PUBLIC'
};

const cache = new InMemoryCache().restore({
    ROOT_QUERY: {
        customer: {
            id: 'customerId',
            firstName: 'Veronica',
            wishlists: []
        }
    }
});

const createWishlistMock = {
    request: {
        query: defaultOperations.createWishlistMutation,
        variables: createWishlistVariables
    },
    result: () => {
        return {
            data: {
                createWishlist: {
                    wishlist: {
                        id: '42',
                        name: 'Test WishList',
                        visibility: 'PUBLIC'
                    }
                }
            }
        };
    }
};

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [createWishlistMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCreateWishlist, { wrapper, ...renderHookOptions });
};

test('should return properly', () => {
    const { result } = renderHookWithProviders();
    expect(result.current).toMatchSnapshot();
});

test('should return error', async () => {
    const createWishlistErrorMock = {
        request: createWishlistMock.request,
        error: new Error('Only 5 wish list(s) can be created.')
    };
    const { result } = renderHookWithProviders({
        mocks: [createWishlistErrorMock]
    });
    await act(() => result.current.handleCreateList(createWishlistVariables));
    expect(
        result.current.formErrors.get('createWishlistMutation')
    ).toMatchInlineSnapshot(`[Error: Only 5 wish list(s) can be created.]`);
});

test('handleShowModal should set isModalOpen to true', async () => {
    const { result } = renderHookWithProviders();
    await act(() => result.current.handleShowModal());
    expect(result.current.isModalOpen).toBe(true);
});

test('handleHideModal should set isModalOpen to false', async () => {
    const { result } = renderHookWithProviders();
    await act(() => result.current.handleHideModal());
    expect(result.current.isModalOpen).toBe(false);
});

test('handleCreateList should update cache and set isModalOpen to false', async () => {
    const { result } = renderHookWithProviders();
    await act(() => result.current.handleCreateList(createWishlistVariables));
    const updatedCache = cache.extract();
    expect(updatedCache[`ROOT_QUERY`].customer.wishlists[0].id).toBe('42');
    expect(result.current.isModalOpen).toBe(false);
});
