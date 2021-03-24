import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        id
        description
        name
        product_count
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            name
            price {
                regularPrice {
                    amount {
                        currency
                        value
                    }
                }
            }
            small_image {
                url
            }
            url_key
            url_suffix
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
