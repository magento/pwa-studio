import { gql } from '@apollo/client';

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
                        region_id
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
                            carrier
                            number
                        }
                    }
                    shipping_address {
                        city
                        country_code
                        firstname
                        lastname
                        postcode
                        region_id
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
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS
};
