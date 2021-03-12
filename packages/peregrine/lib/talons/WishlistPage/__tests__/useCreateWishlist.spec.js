import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useCreateWishlist } from '../useCreateWishlist';
import defaultOperations from '../createWishlist.gql';
import wishlistPageOperations from '../wishlistPage.gql';

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

const createWishlistVariables = {
    name: 'Test WishList',
    visibility: 'PUBLIC'
};

let createWishlistMutationCalled = false;
let getCustomerWishlistsQueryCalled = false;

const getCustomerWishlistsMock = {
    request: {
        query: wishlistPageOperations.getCustomerWishlistQuery
    },
    loading: false,
    result: () => {
        getCustomerWishlistsQueryCalled = true;
        return {
            data: {
                customer: {
                    id: 'customerId',
                    wishlists: [
                        {
                            id: 42,
                            items_count: 0,
                            name: 'Test WishList',
                            visibility: 'PUBLIC',
                            sharing_code: 'code'
                        }
                    ]
                }
            }
        };
    }
};

const createWishlistMock = {
    request: {
        query: defaultOperations.createWishlistMutation,
        variables: { input: createWishlistVariables }
    },
    result: () => {
        createWishlistMutationCalled = true;
        return {
            data: {
                createWishlist: {
                    wishlist: {
                        id: '42'
                    }
                }
            }
        };
    }
};

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [createWishlistMock, getCustomerWishlistsMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
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
    expect(createWishlistMutationCalled).toBe(true);
    expect(getCustomerWishlistsQueryCalled).toBe(true);
    expect(result.current.isModalOpen).toBe(false);
});
