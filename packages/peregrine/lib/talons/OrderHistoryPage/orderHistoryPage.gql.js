import { gql } from '@apollo/client';

const CustomerOrdersFragment = gql`
    fragment CustomerOrdersFragment on CustomerOrders {
        items {
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
    query GetCustomerOrders(
        $filter: CustomerOrdersFilterInput
        $pageSize: Int!
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            orders(filter: $filter, pageSize: $pageSize) {
                ...CustomerOrdersFragment
            }
        }
    }
    ${CustomerOrdersFragment}
`;

export default {
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS
};
