import { gql } from '@apollo/client';
import { ProductListingFragment } from './productListingFragments.gql';

const GET_PRODUCT_LISTING = gql`
    query GetProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default {
    getProductListingQuery: GET_PRODUCT_LISTING
};
