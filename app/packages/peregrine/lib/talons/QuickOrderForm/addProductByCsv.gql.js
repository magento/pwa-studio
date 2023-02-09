import { gql } from '@apollo/client';

export const GET_PARENT_SKU = gql`
    query getParentSku($sku: String) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                orParentSku
                uid
            }
        }
    }
`;

export const GET_PRODUCT_BY_SKU = gql`
    query getproduct($sku: String!) {
        # Limit results to first three.
        products(search: $sku) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                orParentSku
                id
                uid
                name
                sku
                price {
                    minimalPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
        }
    }
`;

export default {
    getParentSkuQuery: GET_PARENT_SKU,
    getProductBySkuQuery: GET_PRODUCT_BY_SKU
};
