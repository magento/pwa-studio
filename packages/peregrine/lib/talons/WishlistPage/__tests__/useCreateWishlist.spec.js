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
    name: 'Test WishList'
};

let createWishlistMutationCalled = false;
let getCustomerWishlistsQueryCalled = false;
let getMultipleWishlistsEnabledQueryCalled = false;

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
                            name: 'My first wishList',
                            visibility: 'PRIVATE',
                            sharing_code: 'code'
                        },
                        {
                            id: 43,
                            items_count: 0,
                            name: 'My second wishList',
                            visibility: 'PRIVATE',
                            sharing_code: 'code'
                        },
                        {
                            id: 44,
                            items_count: 0,
                            name: 'My third wishList',
                            visibility: 'PRIVATE',
                            sharing_code: 'code'
                        }
                    ]
                }
            }
        };
    }
};

const getMultipleWishlistsEnabledQueryMock = {
    request: {
        query: defaultOperations.getMultipleWishlistsEnabledQuery
    },
    loading: false,
    result: () => {
        getMultipleWishlistsEnabledQueryCalled = true;
        return {
            data: {
                storeConfig: {
                    store_code: 'default',
                    enable_multiple_wishlists: '1',
                    maximum_number_of_wishlists: 3
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
    mocks = [
        createWishlistMock,
        getCustomerWishlistsMock,
        getMultipleWishlistsEnabledQueryMock
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    const numberOfWishlists = mocks[1].result().data?.customer?.wishlists
        ?.length;

    return renderHook(
        () =>
            useCreateWishlist({
                numberOfWishlists: numberOfWishlists
            }),
        { wrapper, ...renderHookOptions }
    );
};

test('should return properly', async () => {
    const { result } = renderHookWithProviders();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(getMultipleWishlistsEnabledQueryCalled).toBe(true);
    expect(result.current).toMatchSnapshot();
});

test('shouldRender is false when multiple wishlists disabled', async () => {
    const multipleWishlistsDisabledMock = {
        request: getMultipleWishlistsEnabledQueryMock.request,
        result: {
            data: {
                storeConfig: {
                    store_code: 'default',
                    enable_multiple_wishlists: '0',
                    maximum_number_of_wishlists: 3
                }
            }
        }
    };
    const { result } = renderHookWithProviders({
        mocks: [
            createWishlistMock,
            getCustomerWishlistsMock,
            multipleWishlistsDisabledMock
        ]
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(result.current.shouldRender).toBe(false);
});

test('shouldRender is false if number of multiple wishlists reaches maximum limit number', async () => {
    const multipleWishlistsDisabledMock = {
        request: getMultipleWishlistsEnabledQueryMock.request,
        result: {
            data: {
                storeConfig: {
                    store_code: 'default',
                    enable_multiple_wishlists: '1',
                    maximum_number_of_wishlists: 3
                }
            }
        }
    };
    const { result } = renderHookWithProviders({
        mocks: [
            createWishlistMock,
            getCustomerWishlistsMock,
            multipleWishlistsDisabledMock
        ]
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(result.current.shouldRender).toBe(false);
});

test('should return error', async () => {
    const createWishlistErrorMock = {
        request: createWishlistMock.request,
        error: new Error('Only 5 wish list(s) can be created.')
    };
    const { result } = renderHookWithProviders({
        mocks: [createWishlistErrorMock, getMultipleWishlistsEnabledQueryMock]
    });
    await act(() => result.current.handleCreateList(createWishlistVariables));
    expect(result.current.formErrors.get('createWishlistMutation'))
        .toMatchInlineSnapshot(`
        [Error: No more mocked responses for the query: mutation createWishlist($input: CreateWishlistInput!) {
          createWishlist(input: $input) {
            wishlist {
              id
            }
          }
        }

        Expected variables: {"input":{"name":"Test WishList","visibility":"PRIVATE"}}

        Failed to match 1 mock for this query, which had the following variables:
          {"input":{"name":"Test WishList"}}
        ]
    `);
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
