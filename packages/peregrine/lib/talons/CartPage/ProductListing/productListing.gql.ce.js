import { gql } from '@apollo/client';
import { ProductListingFragment } from './productListingFragments.gql';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForCartPageCE {
        storeConfig {
            id
            magento_wishlist_general_is_enabled
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
