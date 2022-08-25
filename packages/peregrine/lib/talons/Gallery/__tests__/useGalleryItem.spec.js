import React from 'react';
import { useGalleryItem } from '../useGalleryItem';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useGalleryItem({ ...props });

    return <i talonProps={talonProps} />;
};

describe('returns correct shape when multiple wishlists are', () => {
    test('disabled', () => {
        const { root } = createTestInstance(<Component />);
        const { talonProps } = root.findByType('i').props;
        expect(talonProps).toMatchInlineSnapshot(`
            Object {
              "handleLinkClick": [Function],
              "isSupportedProductType": false,
              "itemRef": Object {
                "current": null,
              },
              "wishlistButtonProps": null,
            }
        `);
    });

    test('enabled', () => {
        const props = {
            item: 'Austin FC Jersey',
            storeConfig: {
                magento_wishlist_general_is_enabled: '1'
            }
        };
        const { root } = createTestInstance(<Component {...props} />);
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchInlineSnapshot(`
            Object {
              "handleLinkClick": [Function],
              "isSupportedProductType": false,
              "item": "Austin FC Jersey",
              "itemRef": Object {
                "current": null,
              },
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
