import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            uid
            name
            price_range {
                maximum_price {
                    regular_price {
                        currency
                        value
                    }
                }
            }
            sku
            small_image {
                url
            }
            stock_status
            only_x_left_in_stock
            rating_summary
            __typename
            url_key
            ... on ConfigurableProduct {
                variants {
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    product {
                        uid
                        stock_status
                        only_x_left_in_stock
                    }
                }
            }
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
