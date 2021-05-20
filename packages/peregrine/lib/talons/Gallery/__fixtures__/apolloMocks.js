import operations from '../gallery.gql.ee';

export const mockGetWishlistConfig = {
    request: {
        query: operations.getWishlistConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                id: 1,
                magento_wishlist_general_is_enabled: '1',
                enable_multiple_wishlists: '1'
            }
        }
    }
};
