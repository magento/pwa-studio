import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        id
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
            rating_summary
            type_id
            url_key
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
