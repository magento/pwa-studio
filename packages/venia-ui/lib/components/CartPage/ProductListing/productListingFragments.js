import gql from 'graphql-tag';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            product {
                name
                small_image {
                    url
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    option_label
                    value_label
                }
            }
        }
    }
`;
