import gql from 'graphql-tag';

const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        total_quantity
        items {
            id
            product {
                id
                name
                thumbnail {
                    url
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;

const LIST_OF_PRODUCTS_IN_CART_QUERY = gql`
    query getItemsInCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }

    ${ProductListingFragment}
`;

export default LIST_OF_PRODUCTS_IN_CART_QUERY;
