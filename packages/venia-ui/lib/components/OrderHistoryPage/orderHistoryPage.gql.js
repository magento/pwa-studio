import gql from 'graphql-tag';

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
                    items {
                        id
                        product_sku
                    }
                    number
                    order_date
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

export const OrderHistoryTypeDefs = gql`
    extend type Customer {
        orders: CustomerOrders
    }

    type CustomerOrders {
        items: [CustomerOrder]!
    }

    type CustomerOrder {
        id: ID!
        order_date: String!
        status: String!
        number: String!
        items: [OrderItemInterface]
        total: OrderTotal
    }

    interface OrderItemInterface {
        id: ID!
        product_sku: String!
    }

    type OrderItem implements OrderItemInterface {
        id: ID!
        product_sku: String!
    }

    type OrderTotal {
        grand_total: Money!
    }
`;
/* eslint-enable graphql/template-strings */

export const OrderHistoryResolvers = {
    Customer: {
        orders: () => ({
            __typename: 'CustomerOrders',
            items: [
                {
                    __typename: 'CustomerOrder',
                    id: 1,
                    items: [
                        {
                            __typename: 'OrderItem',
                            id: '1',
                            product_sku: 'dress-1'
                        },
                        {
                            __typename: 'OrderItem',
                            id: '2',
                            product_sku: 'dress-2'
                        },
                        {
                            __typename: 'OrderItem',
                            id: '3',
                            product_sku: 'dress-3'
                        },
                        {
                            __typename: 'OrderItem',
                            id: '4',
                            product_sku: 'dress-4'
                        },
                        {
                            __typename: 'OrderItem',
                            id: '5',
                            product_sku: 'dress-5'
                        }
                    ],
                    number: '167643',
                    order_date: '2020-08-26 18:22:35',
                    status: 'Shipped',
                    total: {
                        __typename: 'OrderTotal',
                        grand_total: {
                            __typename: 'Money',
                            currency: 'USD',
                            value: 1234.56
                        }
                    }
                },
                {
                    __typename: 'CustomerOrder',
                    id: 2,
                    items: [
                        {
                            __typename: 'OrderItem',
                            id: '20',
                            product_sku: 'pants'
                        }
                    ],
                    number: '1477634',
                    order_date: '2020-05-26 18:22:35',
                    status: 'Processing',
                    total: {
                        __typename: 'OrderTotal',
                        grand_total: {
                            __typename: 'Money',
                            currency: 'USD',
                            value: 200.0
                        }
                    }
                }
            ]
        })
    }
};

export default {
    mutations: {},
    queries: {
        getCustomerOrdersQuery: GET_CUSTOMER_ORDERS
    }
};
