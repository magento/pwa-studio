import { gql } from '@apollo/client';

/*
    This feature is being built ahead of GraphQL coverage that is landing in 2.4.1 of Magento. We're going to mock
    the data based on the approved schema to make removing the mocking layer as seamless as possible.

    @see https://github.com/magento/architecture/blob/master/design-documents/graph-ql/coverage/customer-orders.md
 */

/* eslint-disable graphql/template-strings */
export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders {
        customer {
            id
            orders @client {
                items {
                    billing_address {
                        city
                        country {
                            code
                            label
                        }
                        firstname
                        lastname
                        postcode
                        region {
                            code
                            label
                        }
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
                        product_sale_price
                        product_sku
                        product_url_key
                        selected_options {
                            id
                            value
                        }
                        quantity_ordered
                    }
                    number
                    order_date
                    order_total {
                        discounts {
                            amount {
                                currency
                                value
                            }
                            label
                        }
                        grand_total
                        subtotal
                        taxes {
                            amount
                            rate
                            title
                        }
                        total_shipping
                    }
                    payment_methods {
                        name
                        type
                    }
                    shipments {
                        id
                    }
                    shipping_address {
                        city
                        country {
                            code
                            label
                        }
                        firstname
                        lastname
                        postcode
                        region {
                            code
                            label
                        }
                        street
                        telephone
                    }
                    shipping_method
                    status
                    total {
                        grand_total {
                            currency
                            value
                        }
                    }
                }
            }
        }
    }
`;
/* eslint-enable graphql/template-strings */

const MOCK_ORDERS = {
    items: [
        {
            billing_address: {
                city: 'Austin',
                country: {
                    code: 'US',
                    label: 'United States of America'
                },
                firstname: 'Gooseton',
                lastname: 'Jr',
                postcode: '78759',
                region: {
                    code: 'TX',
                    label: 'Texas'
                },
                street: 'Goose Dr',
                telephone: '9123456789'
            },
            id: 1,
            invoices: [{ id: 1 }],
            items: [
                {
                    id: '1',
                    product_name: 'Product 1',
                    product_sale_price: '100',
                    product_sku: 'VSW01',
                    product_url_key: '',
                    selected_options: {
                        id: 'Color',
                        value: 'Green'
                    },
                    quantity_ordered: 1
                },
                {
                    id: '2',
                    product_sku: 'VD02'
                },
                {
                    id: '3',
                    product_sku: 'VT02'
                },
                {
                    id: '4',
                    product_sku: 'VP08'
                },
                {
                    id: '5',
                    product_sku: 'VA03'
                }
            ],
            number: '000000002',
            order_date: '2020-08-26 18:22:35',
            shipments: [],
            status: 'Processing',
            total: {
                grand_total: {
                    currency: 'USD',
                    value: 1234.56
                }
            }
        },
        {
            id: 2,
            invoices: [{ id: 1 }],
            items: [
                {
                    id: '20',
                    product_sku: 'VA03'
                }
            ],
            number: '000000005',
            order_date: '2020-05-26 18:22:35',
            shipments: [{ id: 1 }],
            status: 'Complete',
            total: {
                grand_total: {
                    currency: 'USD',
                    value: 200.0
                }
            }
        }
    ]
};

export const CUSTOM_TYPES = {
    Customer: {
        fields: {
            orders: {
                read(cached) {
                    return cached || MOCK_ORDERS;
                }
            }
        }
    }
};

export default {
    queries: {
        getCustomerOrdersQuery: GET_CUSTOMER_ORDERS
    },
    types: CUSTOM_TYPES
};
