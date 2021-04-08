import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, act } from '@testing-library/react-hooks';

import { useCreateWishlistForm } from '../useCreateWishlistForm';

import defaultOperations from '../createWishlistForm.gql';

jest.mock('informed', () => {
    return {
        useFormState: jest.fn().mockReturnValue({
            values: {
                listname: 'MyList',
                visibility: 'PUBLIC'
            }
        })
    };
});

const mockOnCancel = jest.fn();
const mockOnCreateList = jest.fn();
const mockWishlistId = '1';
const initialProps = {
    onCancel: mockOnCancel,
    onCreateList: mockOnCreateList,
    isAddLoading: false
};

const createWishlistMock = {
    request: {
        query: defaultOperations.createWishlistMutation,
        variables: {
            name: 'MyList',
            visibility: 'PUBLIC'
        }
    },
    result: {
        data: {
            createWishlist: {
                wishlist: {
                    id: mockWishlistId
                }
            }
        }
    }
};

const createWishlistErrorMock = {
    request: {
        query: defaultOperations.createWishlistMutation,
        variables: {
            name: 'MyList',
            visibility: 'PUBLIC'
        }
    },
    result: {
        data: {
            createWishlist: {
                wishlist: {
                    id: '1'
                }
            }
        }
    },
    error: new Error('Oopsie!')
};

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [createWishlistMock]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCreateWishlistForm, { wrapper, ...renderHookOptions });
};

test('returns correct shape', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "formErrors": Array [
            undefined,
          ],
          "handleCancel": [Function],
          "handleSave": [Function],
          "isSaveDisabled": false,
        }
    `);
});

test('isSaveDisabled is true if isAddLoading prop is true', () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: {
                ...initialProps,
                isAddLoading: true
            }
        }
    });

    expect(result.current.isSaveDisabled).toMatchInlineSnapshot(`true`);
});

test('isSaveDisabled is true if mutation is in flight', async () => {
    const { result } = renderHookWithProviders();

    act(() => result.current.handleSave());

    expect(result.current.isSaveDisabled).toMatchInlineSnapshot(`true`);
});

test('returns formErrors with errors from mutation', async () => {
    const { result } = renderHookWithProviders({
        mocks: [createWishlistErrorMock]
    });

    await act(async () => await result.current.handleSave());

    expect(result.current.formErrors).toMatchInlineSnapshot(`
        Array [
          [Error: Oopsie!],
        ]
    `);
});

test('handleSave calls mutation and then invokes onCreateList with created id', async () => {
    const { result } = renderHookWithProviders();

    await act(async () => await result.current.handleSave());

    expect(mockOnCreateList).toHaveBeenCalledWith(mockWishlistId);
});

test('handleCancel invokes onCancel', () => {
    const { result } = renderHookWithProviders();

    act(() => result.current.handleCancel());

    expect(mockOnCancel).toHaveBeenCalled();
});
