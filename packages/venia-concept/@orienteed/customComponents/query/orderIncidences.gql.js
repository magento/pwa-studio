import { gql } from '@apollo/client';

const CustomerOrdersFragment = gql`
    fragment CustomerOrdersFragment on CustomerOrders {
        items {
            id
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
            shipping_method
            status
        }
    }
`;

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($filter: CustomerOrdersFilterInput) {
        customer {
            id
            orders(filter: $filter) {
                ...CustomerOrdersFragment
            }
        }
    }
    ${CustomerOrdersFragment}
`;

export const INCIDENCE_SUBMIT_EMAIL = gql`
    mutation orderIncidencesEmail($input: OrderIncidencesEmailInput) {
        orderIncidencesEmail(input: $input) {
            status
            message
        }
    }
`;

export default {
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS,
    sendIncidenceEmail: INCIDENCE_SUBMIT_EMAIL
};
