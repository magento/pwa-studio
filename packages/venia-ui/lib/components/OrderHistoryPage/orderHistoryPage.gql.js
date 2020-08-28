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
                    id
                    invoices {
                        id
                    }
                    items {
                        id
                        product_sku
                    }
                    number
                    order_date
                    shipments {
                        id
                    }
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
            id: 1,
            invoices: [{ id: 1 }],
            items: [
                {
                    id: '1',
                    product_sku: 'VSW01'
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
