import { gql } from '@apollo/client';
import { ProductListingFragment } from './productListingFragments.gql';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForCartPageEE {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            magento_wishlist_general_is_enabled
            enable_multiple_wishlists
        }
    }
`;

const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getProductListingQuery: GET_PRODUCT_LISTING
};
