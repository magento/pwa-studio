import { gql } from '@apollo/client';

export const GET_PRODUCTS_FOR_PAGEBUILDER_BY_URL_KEY = gql`
    query GetProductsForPagebuilderByUrlKey($url_keys: [String], $pageSize: Int!) {
        products(filter: { url_key: { in: $url_keys } }, pageSize: $pageSize) {
            items {
                id
                uid
                name
                url_suffix
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                    }
                }
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    minimalPrice {
                        amount {
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
                __typename
                url_key
            }
            total_count
            filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                }
            }
        }
    }
`;

export default {
    getProductsQuery: GET_PRODUCTS_FOR_PAGEBUILDER_BY_URL_KEY
};
