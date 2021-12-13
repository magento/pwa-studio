import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useWishlistDialog } from '../useWishlistDialog';

import defaultOperations from '../wishlistDialog.gql';

const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();

const initialProps = {
    isLoading: false,
    itemOptions: {
        sku: 'MyProductSku',
        quantity: 1
    },
    onClose: mockOnClose,
    onSuccess: mockOnSuccess
};

const mockWishlistId = '1';
const addProductToWishlistMock = {
    request: {
        query: defaultOperations.addProductToWishlistMutation,
        variables: {
            wishlistId: mockWishlistId,
            itemOptions: initialProps.itemOptions
        }
    },
    result: {
        data: {
            addProductsToWishlist: {
                user_errors: [],
                wishlist: {
                    name: 'Favorites List'
                }
            }
        }
    }
};

const addProductToWishlistErrorMock = {
    request: {
        query: defaultOperations.addProductToWishlistMutation,
        variables: {
            wishlistId: mockWishlistId,
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

const getWishlistEnabledMock = {
    request: {
        query: defaultOperations.getWishlistsQuery
    },
    result: {
        data: {
            storeConfig: {
                enable_multiple_wishlists: true,
                maximum_number_of_wishlists: 2,
                store_code: 'storeId'
            },
            customer: {
                id: 'customerId',
                wishlists: [
                    {
                        id: mockWishlistId,
                        name: 'My Wishlist'
                    }
                ]
            }
        }
    }
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [
        addProductToWishlistMock,
        getWishlistEnabledMock,
        // TODO: I don't know why I have to pass a second mock - if I don't the mutation call throws an error about not having any more mocked responses...
        getWishlistEnabledMock
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useWishlistDialog, { wrapper, ...renderHookOptions });
};

test('returns correct shape', async () => {
    const { result } = renderHookWithProviders();

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "canCreateWishlist": true,
          "formErrors": Array [
            undefined,
          ],
          "handleAddToWishlist": [Function],
          "handleCancel": [Function],
          "handleCancelNewList": [Function],
          "handleNewListClick": [Function],
          "isFormOpen": false,
          "isLoading": false,
          "wishlistsData": Object {
            "customer": Object {
              "wishlists": Array [
                Object {
                  "id": "1",
                  "name": "My Wishlist",
                },
              ],
            },
            "storeConfig": Object {
              "enable_multiple_wishlists": true,
              "maximum_number_of_wishlists": 2,
              "store_code": "storeId",
            },
          },
        }
    `);
});

test('formErrors includes errors from add product mutation', async () => {
    const { result } = renderHookWithProviders({
        mocks: [addProductToWishlistErrorMock, getWishlistEnabledMock]
    });

    await act(
        async () => await result.current.handleAddToWishlist(mockWishlistId)
    );

    expect(result.current.formErrors).toMatchInlineSnapshot(`
        Array [
          [Error: Oopsie!],
        ]
    `);
});

test('handleAddToWishlist calls mutation, onSuccess, onClose(true) and setIsformOpen(false)', async () => {
    const { result } = renderHookWithProviders();

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        result.current.handleNewListClick();
        await result.current.handleAddToWishlist(mockWishlistId);
    });

    expect(mockOnClose.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          true,
          Object {
            "wishlistName": "Favorites List",
          },
        ]
    `);
    expect(mockOnSuccess.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "addProductsToWishlist": Object {
              "user_errors": Array [],
              "wishlist": Object {
                "name": "Favorites List",
              },
            },
          },
        ]
    `);
    expect(result.current.isFormOpen).toMatchInlineSnapshot(`false`);
});

test('canCreateWishlist is false if customer wishlist count is gte the maximum number of wishlists', async () => {
    const getWishlistDisabledMock = {
        request: {
            query: defaultOperations.getWishlistsQuery
        },
        result: {
            data: {
                storeConfig: {
                    enable_multiple_wishlists: true,
                    maximum_number_of_wishlists: 2,
                    store_code: 'storeId'
                },
                customer: {
                    id: 'customerId',
                    wishlists: [
                        {
                            id: '1',
                            name: 'My Wishlist'
                        },
                        {
                            id: '2',
                            name: 'My 2nd Wishlist'
                        }
                    ]
                }
            }
        }
    };

    const { result } = renderHookWithProviders({
        mocks: [getWishlistDisabledMock]
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.canCreateWishlist).toMatchInlineSnapshot(`false`);
});

test('canCreateWishlist is false if enable_multiple_wishlists is false', async () => {
    const getWishlistDisabledMock = {
        request: {
            query: defaultOperations.getWishlistsQuery
        },
        result: {
            data: {
                storeConfig: {
                    store_code: 'storeId',
                    enable_multiple_wishlists: false,
                    maximum_number_of_wishlists: 1
                },
                customer: {
                    id: 'customerId',
                    wishlists: [
                        {
                            id: mockWishlistId,
                            name: 'My Wishlist'
                        }
                    ]
                }
            }
        }
    };

    const { result } = renderHookWithProviders({
        mocks: [getWishlistDisabledMock]
    });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.canCreateWishlist).toMatchInlineSnapshot(`false`);
});

test('handleNewListClick calls setIsFormOpen(true)', () => {
    const { result } = renderHookWithProviders();

    act(() => result.current.handleNewListClick());

    expect(result.current.isFormOpen).toMatchInlineSnapshot(`true`);
});

test('handleCancelNewList calls setIsFormOpen(false)', () => {
    const { result } = renderHookWithProviders();

    act(() => result.current.handleNewListClick());

    expect(result.current.isFormOpen).toMatchInlineSnapshot(`true`);

    act(() => result.current.handleCancelNewList());

    expect(result.current.isFormOpen).toMatchInlineSnapshot(`false`);
});

test('handleCancel calls onClose() and setIsFormOpen(false)', () => {
    const { result } = renderHookWithProviders();

    act(() => result.current.handleNewListClick());

    expect(result.current.isFormOpen).toMatchInlineSnapshot(`true`);

    act(() => result.current.handleCancel());

    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.isFormOpen).toMatchInlineSnapshot(`false`);
});
