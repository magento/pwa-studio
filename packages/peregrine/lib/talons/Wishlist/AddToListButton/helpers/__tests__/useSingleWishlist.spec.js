import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { act, renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import operations from '../../addToListButton.gql';
import { useSingleWishlist } from '../useSingleWishlist';

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

const cache = new InMemoryCache({
    typePolicies
});

beforeEach(() => {
    cache.restore({
        ROOT_QUERY: {
            customerWishlistProducts: ['shirt']
        }
    });
});

const mockNewItem = {
    quantity: 1,
    sku: 'pants'
};

const mockMutationSuccess = {
    request: {
        query: operations.addProductToWishlistMutation,
        variables: {
            wishlistId: '0',
            itemOptions: mockNewItem
        }
    },
    result: {
        data: {
            user_errors: []
        }
    }
};

const mockErrorItem = {
    sku: 'holy-grail'
};

const mockMutationError = {
    request: {
        query: operations.addProductToWishlistMutation,
        variables: {
            wishlistId: '0',
            sku: mockErrorItem.sku
        }
    },
    error: new Error('WHAT is the airspeed velocity of an unladen swallow?')
};

const initialProps = {
    item: {
        sku: 'shirt'
    }
};

const renderHookWithProviders = ({
    renderHookOptions = {
        initialProps
    },
    mocks = [mockMutationError, mockMutationSuccess]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useSingleWishlist, { wrapper, ...renderHookOptions });
};

test('returns correct shape for selected product', () => {
    const { result } = renderHookWithProviders();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": Object {
            "aria-label": "Add to Favorites",
            "isDisabled": true,
            "onPress": [Function],
            "type": "button",
          },
          "buttonText": undefined,
          "customerWishlistProducts": Array [
            "shirt",
          ],
          "errorToastProps": null,
          "handleClick": [Function],
          "isSelected": true,
          "loginToastProps": null,
          "successToastProps": null,
        }
    `);
});

test('onClick returns login toast props when not logged in', () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);

    const { result } = renderHookWithProviders();
    const { onPress } = result.current.buttonProps;

    act(() => {
        onPress();
    });

    expect(result.current.loginToastProps).toMatchInlineSnapshot(`
        Object {
          "message": "Please sign-in to your Account to save items for later.",
          "timeout": 5000,
          "type": "info",
        }
    `);
});

test('onClick returns success toast props and updates cache', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockNewItem } }
    });

    const { onPress } = result.current.buttonProps;

    await act(async () => {
        await onPress();
    });

    const updatedCache = cache.readQuery({
        query: operations.getProductsInWishlistsQuery
    });

    expect(result.current.successToastProps).toMatchInlineSnapshot(`
        Object {
          "message": "Item successfully added to your favorites list.",
          "timeout": 5000,
          "type": "success",
        }
    `);

    expect(updatedCache.customerWishlistProducts).toContain(mockNewItem.sku);
});

test('onClick returns error toast props', async () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockErrorItem } }
    });

    const { onPress } = result.current.buttonProps;

    await act(async () => {
        await onPress();
    });

    expect(result.current.errorToastProps).toMatchInlineSnapshot(`
        Object {
          "message": "Something went wrong adding the product to your wishlist.",
          "timeout": 5000,
          "type": "error",
        }
    `);
});

test('button appears selected while mutation is in flight', () => {
    const { result } = renderHookWithProviders({
        renderHookOptions: { initialProps: { item: mockNewItem } }
    });

    expect(result.current.isSelected).toBe(false);
    expect(result.current.buttonProps.isDisabled).toBe(false);

    const { onPress } = result.current.buttonProps;

    act(() => {
        onPress();
    });

    expect(result.current.isSelected).toBe(true);
    expect(result.current.buttonProps.isDisabled).toBe(true);
});

test('returns buttonText based on selected status', () => {
    const buttonTextRenderProp = isSelected =>
        isSelected ? 'Selected' : 'Not Selected';

    const { rerender, result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: {
                ...initialProps,
                buttonText: buttonTextRenderProp
            }
        }
    });

    expect(result.current.buttonText).toMatchInlineSnapshot(`"Selected"`);

    rerender({
        item: { sku: 'new-shirt' },
        buttonText: buttonTextRenderProp
    });

    expect(result.current.buttonText).toMatchInlineSnapshot(`"Not Selected"`);
});

test('executes before and after methods', async () => {
    const beforeAdd = jest.fn().mockResolvedValue(undefined);
    const afterAdd = jest.fn();

    const { result } = renderHookWithProviders({
        renderHookOptions: {
            initialProps: {
                afterAdd,
                beforeAdd,
                item: mockNewItem
            }
        }
    });

    expect(beforeAdd).not.toHaveBeenCalled();
    expect(afterAdd).not.toHaveBeenCalled();

    await act(async () => {
        await result.current.buttonProps.onPress();
    });

    expect(beforeAdd).toHaveBeenCalled();
    expect(afterAdd).toHaveBeenCalled();
});
