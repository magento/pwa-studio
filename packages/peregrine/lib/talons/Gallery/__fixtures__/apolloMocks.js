import eeOperations from '../gallery.gql.ee';
import ceOperations from '../gallery.gql.ce';

export const mockGetWishlistConfigEE = {
    request: {
        query: eeOperations.getWishlistConfigQuery
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

export const mockGetWishlistConfigCE = {
    request: {
        query: ceOperations.getWishlistConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                id: 1,
                magento_wishlist_general_is_enabled: '1'
            }
        }
    }
};
