import { useAddToListButton } from '../useAddToListButton';
import { act, renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(() => 'graphql-ast'),
    useApolloClient: jest.fn().mockReturnValue({
        writeQuery: jest.fn()
    })
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

jest.mock('../helpers/useSingleWishlist', () => ({
    useSingleWishlist: jest.fn().mockReturnValue({
        buttonProps: {
            singleButtonProp: 'singleButtonValue',
            onPress: jest.fn().mockName('useSingleWishlist.onPress')
        },
        customerWishlistProducts: [],
        singleWishlistProp: 'singleWishlistValue',
        successToastProps: {
            singleSuccessProp: 'singleSuccessValue'
        }
    })
}));

const initialProps = {
    item: {
        quantity: 1,
        sku: 'holy-grail'
    },
    storeConfig: {
        enable_multiple_wishlists: '1'
    }
};

test('returns single wishlist props when multiple wishlists is disabled', () => {
    const singleWishlistProps = {
        ...initialProps,
        storeConfig: {
            enable_multiple_wishlists: '0'
        }
    };

    const { result } = renderHook(useAddToListButton, {
        initialProps: singleWishlistProps
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": Object {
            "onPress": [MockFunction useSingleWishlist.onPress],
            "singleButtonProp": "singleButtonValue",
          },
          "customerWishlistProducts": Array [],
          "modalProps": null,
          "singleWishlistProp": "singleWishlistValue",
          "successToastProps": Object {
            "singleSuccessProp": "singleSuccessValue",
          },
        }
    `);
});

test('returns multiple wishlist props when enabled', () => {
    const { result } = renderHook(useAddToListButton, { initialProps });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": Object {
            "aria-haspopup": "dialog",
            "onPress": [Function],
            "singleButtonProp": "singleButtonValue",
          },
          "customerWishlistProducts": Array [],
          "modalProps": Object {
            "isOpen": false,
            "itemOptions": Object {
              "quantity": 1,
              "sku": "holy-grail",
            },
            "onClose": [Function],
          },
          "singleWishlistProp": "singleWishlistValue",
          "successToastProps": Object {
            "singleSuccessProp": "singleSuccessValue",
          },
        }
    `);
});

test('onPress handler opens modal', () => {
    const { result } = renderHook(useAddToListButton, { initialProps });

    expect(result.current.modalProps.isOpen).toBe(false);

    act(() => {
        result.current.buttonProps.onPress();
    });

    expect(result.current.modalProps.isOpen).toBe(true);
});

test('handleModalClose updates cache and updates toast props', () => {
    const mockApolloClient = useApolloClient();
    const { result } = renderHook(useAddToListButton, { initialProps });

    act(() => {
        result.current.buttonProps.onPress();
    });

    act(() => {
        result.current.modalProps.onClose(true, {
            wishlistName: 'Favorites List'
        });
    });

    const cacheWriteProps = mockApolloClient.writeQuery.mock.calls[0][0];

    expect(result.current.modalProps.isOpen).toBe(false);
    expect(cacheWriteProps).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "customerWishlistProducts": Array [
              "holy-grail",
            ],
          },
          "query": "graphql-ast",
        }
    `);
    expect(result.current.successToastProps).toMatchInlineSnapshot(`
        Object {
          "message": "Item successfully added to the \\"Favorites List\\" list.",
          "timeout": 5000,
          "type": "success",
        }
    `);
});

test('executes before and after methods', () => {
    const beforeAdd = jest.fn();
    const afterAdd = jest.fn();

    const { result } = renderHook(useAddToListButton, {
        initialProps: {
            ...initialProps,
            beforeAdd,
            afterAdd
        }
    });

    expect(beforeAdd).not.toHaveBeenCalled();
    expect(afterAdd).not.toHaveBeenCalled();

    act(() => {
        result.current.buttonProps.onPress();
    });

    expect(beforeAdd).toHaveBeenCalled();

    act(() => {
        result.current.modalProps.onClose(true, {
            wishlistName: 'Favorites List'
        });
    });

    expect(afterAdd).toHaveBeenCalled();
});
