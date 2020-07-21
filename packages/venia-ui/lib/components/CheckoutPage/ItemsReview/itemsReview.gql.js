import { gql } from '@apollo/client';

import { ItemsReviewFragment } from './itemsReviewFragments.gql';

const LIST_OF_PRODUCTS_IN_CART_QUERY = gql`
    query getItemsInCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ItemsReviewFragment
        }
    }

    ${ItemsReviewFragment}
`;

export default LIST_OF_PRODUCTS_IN_CART_QUERY;
