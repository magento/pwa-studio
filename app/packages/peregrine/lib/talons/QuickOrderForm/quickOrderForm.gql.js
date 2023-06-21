import { gql } from '@apollo/client';

export const GET_PARENT_SKU_BY_SKU = gql`
    query GetParentSkuBySku($sku: String) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                orParentSku
                uid
            }
        }
    }
`;

export const GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU = gql`
    query GetProductDetailForQuickOrderBySku($sku: String!) {
        products(search: $sku) {
            items {
                orParentSku
                id
                uid
                name
                sku
                stock_status
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
    getParentSkuBySkuQuery: GET_PARENT_SKU_BY_SKU,
    getProductBySkuQuery: GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU
};
