import gql from 'graphql-tag';

import { ProductListingFragment } from './ProductListing/productListing.gql';

export const ShoppingBagQuery = gql`
    query ShoppingBagQuery($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            total_quantity
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default {
    queries: {
        ShoppingBagQuery
    },
    mutations: {}
};
