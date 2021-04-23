import { useGalleryButton } from '../useGalleryButton.ee';
import { act, renderHook } from '@testing-library/react-hooks';
import { useApolloClient } from '@apollo/client';

jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn().mockReturnValue({
        cache: {
            modify: jest.fn()
        }
    })
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

jest.mock('../helpers/useSingleWishlist', () => ({
    useSingleWishlist: jest.fn().mockReturnValue({
        buttonProps: {
            singleButtonProp: 'singleButtonValue',
            onClick: jest.fn().mockName('useSingleWishlist.onClick')
        },
        singleWishlistProp: 'singleWishlistValue',
        successToastProps: {
            singleSuccessProp: 'singleSuccessValue'
        }
    })
}));

const initialProps = {
    item: {
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

    const { result } = renderHook(useGalleryButton, {
        initialProps: singleWishlistProps
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": Object {
            "onClick": [MockFunction useSingleWishlist.onClick],
            "singleButtonProp": "singleButtonValue",
          },
          "modalProps": null,
          "singleWishlistProp": "singleWishlistValue",
          "successToastProps": Object {
            "singleSuccessProp": "singleSuccessValue",
          },
        }
    `);
});

test('returns multiple wishlist props when enabled', () => {
    const { result } = renderHook(useGalleryButton, { initialProps });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "buttonProps": Object {
            "onClick": [Function],
            "singleButtonProp": "singleButtonValue",
          },
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

test('onClick handler opens modal', () => {
    const { result } = renderHook(useGalleryButton, { initialProps });

    expect(result.current.modalProps.isOpen).toBe(false);

    act(() => {
        result.current.buttonProps.onClick();
    });

    expect(result.current.modalProps.isOpen).toBe(true);
});

test('handleModalClose updates cache and updates toast props', () => {
    const mockApolloClient = useApolloClient();
    const { result } = renderHook(useGalleryButton, { initialProps });

    act(() => {
        result.current.buttonProps.onClick();
    });

    act(() => {
        result.current.modalProps.onClose(true, {
            wishlistName: 'Favorites List'
        });
    });

    const cacheModifyProps = mockApolloClient.cache.modify.mock.calls[0][0];
    const nextCacheProductResult = cacheModifyProps.fields.customerWishlistProducts(
        ['existing-product']
    );

    expect(result.current.modalProps.isOpen).toBe(false);
    expect(cacheModifyProps).toMatchInlineSnapshot(`
        Object {
          "fields": Object {
            "customerWishlistProducts": [Function],
          },
          "id": "ROOT_QUERY",
        }
    `);
    expect(nextCacheProductResult).toMatchInlineSnapshot(`
        Array [
          "existing-product",
          "holy-grail",
        ]
    `);
    expect(result.current.successToastProps).toMatchInlineSnapshot(`
        Object {
          "message": "Item successfully added to the \\"Favorites List\\" list.",
          "timeout": 5000,
          "type": "success",
        }
    `);
});
