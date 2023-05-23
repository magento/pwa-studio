import { gql } from '@apollo/client';

import { ItemsReviewFragment } from './itemsReviewFragments.gql';

export const LIST_PRODUCTS_IN_CART = gql`
    query GetItemsInCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ItemsReviewFragment
        }
    }

    ${ItemsReviewFragment}
`;

export default {
    getItemsInCartQuery: LIST_PRODUCTS_IN_CART
};
