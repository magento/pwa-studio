import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForGallery($isEE:Boolean = ${process.env
        .MAGENTO_BACKEND_EDITION === 'EE'}) {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists @include(if: $isEE)
            maximum_number_of_wishlists @include(if: $isEE)
        }
    }
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG
};
