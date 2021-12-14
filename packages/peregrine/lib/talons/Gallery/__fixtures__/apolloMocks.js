import eeOperations from '../gallery.gql.ee';
import ceOperations from '../gallery.gql.ce';

export const mockGetStoreConfigEE = {
    request: {
        query: eeOperations.getStoreConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                store_code: 'default',
                magento_wishlist_general_is_enabled: '1',
                enable_multiple_wishlists: '1',
                product_url_suffix: '.html'
            }
        }
    }
};

export const mockGetStoreConfigCE = {
    request: {
        query: ceOperations.getStoreConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                store_code: 'default',
                magento_wishlist_general_is_enabled: '1',
                product_url_suffix: '.html'
            }
        }
    }
};
