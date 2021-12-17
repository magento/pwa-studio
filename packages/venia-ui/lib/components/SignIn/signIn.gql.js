import { gql } from '@apollo/client';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';

export const GET_CART_DETAILS_QUERY = gql`
    query GetCartDetailsAfterSignIn($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableCartItem {
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    configurable_options {
                        configurable_product_option_uid
                        option_label
                        configurable_product_option_value_uid
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;
