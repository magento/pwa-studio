import { gql } from '@apollo/client';

/**
 * query getCustomerOrders($orderId: CustomerOrdersFilterInput) {
  customer {
    id
    orders (filter: $orderId) {
      items {
        id
        items {
          __typename
        }
      }
    }
  }
} # Write your query or mutation here
 */

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders {
        customer {
            id
            orders {
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
            }
        }
    }
`;

export const GET_CUSTOMER_ORDER = gql`
    query GetCustomerOrders ($orderNumber: CustomerOrdersFilterInput) {
        customer {
            id
            orders (filter: $orderNumber) {
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
            }
        }
    }
`;

export default {
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS,
    getCustomerOrderQuery: GET_CUSTOMER_ORDER
};
