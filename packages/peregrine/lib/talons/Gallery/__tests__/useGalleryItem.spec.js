import { useGalleryItem } from '../useGalleryItem';

describe('returns correct shape when multiple wishlists are', () => {
    test('disabled', () => {
        const props = useGalleryItem();
        expect(props).toMatchInlineSnapshot(`
            Object {
              "isSupportedProductType": false,
              "wishlistButtonProps": null,
            }
        `);
    });

    test('enabled', () => {
        const props = useGalleryItem({
            item: 'Austin FC Jersey',
            storeConfig: {
                magento_wishlist_general_is_enabled: '1'
            }
        });

        expect(props).toMatchInlineSnapshot(`
            Object {
              "isSupportedProductType": false,
              "item": "Austin FC Jersey",
              "storeConfig": Object {
                "magento_wishlist_general_is_enabled": "1",
              },
              "wishlistButtonProps": Object {
                "item": Object {
                  "quantity": 1,
                  "sku": undefined,
                },
                "storeConfig": Object {
                  "magento_wishlist_general_is_enabled": "1",
                },
              },
            }
        `);
    });
});
