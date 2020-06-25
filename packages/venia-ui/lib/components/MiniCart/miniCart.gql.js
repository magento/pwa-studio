import gql from 'graphql-tag';

import { ProductListingFragment } from './ProductListing/productListing.gql';

export const SHOPPING_BAG_QUERY = gql`
    query ShoppingBagQuery($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            total_quantity
            prices {
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            prices {
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                total_quantity
                prices {
                    subtotal_excluding_tax {
                        currency
                        value
                    }
                }
                prices {
                    subtotal_excluding_tax {
                        currency
                        value
                    }
                }
                ...ProductListingFragment
            }
        }
    }
    ${ProductListingFragment}
`;

export default {
    queries: {
        shoppingBagQuery: SHOPPING_BAG_QUERY
    },
    mutations: {
        removeItemMutation: REMOVE_ITEM_MUTATION
    }
};
