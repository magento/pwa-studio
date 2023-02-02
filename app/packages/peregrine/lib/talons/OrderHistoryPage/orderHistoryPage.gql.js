import { gql } from '@apollo/client';

const CustomerOrdersFragment = gql`
    fragment CustomerOrdersFragment on CustomerOrders {
        items {
            comment
            external_order_number
            mp_delivery_information {
                mp_delivery_comment
                mp_delivery_date
                mp_delivery_time
                mp_house_security_code
                __typename
            }
            store_id
            billing_address {
                city
                country_code
                firstname
                lastname
                postcode
                region
                street
                telephone
            }
            id
            invoices {
                id
            }
            items {
                id
                product_name
                product_sale_price {
                    currency
                    value
                }
                discounts {
                    amount {
                        currency
                        value
                    }
                    label
                    __typename
                }
                product_sku
                product_url_key
                selected_options {
                    label
                    value
                }
                quantity_ordered
            }
            number
            order_date
            payment_methods {
                name
                type
                additional_data {
                    name
                    value
                }
            }
            shipments {
                id
                tracking {
                    number
                }
            }
            shipping_address {
                city
                country_code
                firstname
                lastname
                postcode
                region
                street
                telephone
            }
            shipping_method
            status
            total {
                discounts {
                    amount {
                        currency
                        value
                    }
                }
                grand_total {
                    currency
                    value
                }
                subtotal {
                    currency
                    value
                }
                total_shipping {
                    currency
                    value
                }
                total_tax {
                    currency
                    value
                }
            }
        }
        page_info {
            current_page
            total_pages
        }
        total_count
    }
`;

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($filter: CustomerOrdersFilterInput, $pageSize: Int!) {
        customer {
            id
            orders(filter: $filter, pageSize: $pageSize) {
                ...CustomerOrdersFragment
            }
        }
    }
    ${CustomerOrdersFragment}
`;

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            code
            store_code
            store_name
            store_group_name
            locale
        }
    }
`;

export default {
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS,
    getStoreConfigData: GET_STORE_CONFIG_DATA
};
