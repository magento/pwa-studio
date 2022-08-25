import acOperations from '../gallery.gql.ee';
import mosOperations from '../gallery.gql.ce';

export const mockGetStoreConfigAC = {
    request: {
        query: acOperations.getStoreConfigQuery
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

export const mockGetStoreConfigMOS = {
    request: {
        query: mosOperations.getStoreConfigQuery
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
