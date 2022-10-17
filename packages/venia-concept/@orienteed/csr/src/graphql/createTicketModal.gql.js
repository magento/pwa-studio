import { gql } from '@apollo/client';

export const GET_CUSTOMER_ORDERS = gql`
    query getCustomerOrders {
        customer {
            orders {
                items {
                    number
                    order_date
                    status
                    total {
                        grand_total {
                            currency
                            value
                        }
                    }
                    items {
                        product_sku
                    }
                }
            }
        }
    }
`;

export const GET_IMAGE_BY_SKU = gql`
    query getImageBySku($sku: String) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                uid
                image {
                    url
                }
            }
        }
    }
`;
