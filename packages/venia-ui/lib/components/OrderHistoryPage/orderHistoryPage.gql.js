import { gql } from '@apollo/client';

/*
    This feature is being built ahead of GraphQL coverage that is landing in 2.4.1 of Magento. We're going to mock
    the data based on the approved schema to make removing the mocking layer as seamless as possible.

    @see https://github.com/magento/architecture/blob/master/design-documents/graph-ql/coverage/customer/customer-orders.md
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
                        product_sale_price
                        product_sku
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
/* eslint-enable graphql/template-strings */

const MOCK_ORDERS = {
    items: [
        {
            billing_address: {
                city: 'Austin',
                country_code: 'US',
                firstname: 'Gooseton',
                lastname: 'Jr',
                postcode: '78759',
                region_id: 'TX',
                street: 'Goose Dr',
                telephone: '9123456789'
            },
            id: 1,
            invoices: [{ id: 1 }],
            items: [
                {
                    id: '1',
                    product_name: 'Product 1',
                    product_sale_price: '$100.00',
                    product_sku: 'VSW01',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Green'
                        }
                    ],
                    quantity_ordered: 1
                },
                {
                    id: '2',
                    product_name: 'Product 2',
                    product_sale_price: '$100.00',
                    product_sku: 'VD02',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Red'
                        }
                    ],
                    quantity_ordered: 10
                },
                {
                    id: '3',
                    product_name: 'Product 3',
                    product_sale_price: '$100.00',
                    product_sku: 'VT02',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Black'
                        }
                    ],
                    quantity_ordered: 1
                },
                {
                    id: '4',
                    product_name: 'Product 4',
                    product_sale_price: '$100.00',
                    product_sku: 'VT11',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Pink'
                        }
                    ],
                    quantity_ordered: 1
                },
                {
                    id: '5',
                    product_name: 'Product 5',
                    product_sale_price: '$100.00',
                    product_sku: 'VSW09',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Grey'
                        }
                    ],
                    quantity_ordered: 1
                }
            ],
            number: '000000002',
            order_date: '2020-08-26 18:22:35',
            payment_methods: [
                {
                    name: 'Braintree',
                    type: 'Credit Card',
                    additional_data: [
                        {
                            name: 'card_type',
                            value: 'Visa'
                        },
                        {
                            name: 'last_four',
                            value: '1234'
                        }
                    ]
                }
            ],
            shipments: [
                {
                    id: '1',
                    tracking: [
                        {
                            carrier: 'Fedex',
                            number: 'FEDEX516351813216541'
                        }
                    ]
                }
            ],
            shipping_address: {
                city: 'Austin',
                country_code: 'US',
                firstname: 'Gooseton',
                lastname: 'Jr',
                postcode: '78759',
                region_id: 'TX',
                street: 'Goose Dr',
                telephone: '9123456789'
            },
            shipping_method: 'Free',
            status: 'Processing',
            total: {
                discounts: [
                    {
                        amount: {
                            currency: 'USD',
                            value: 123
                        }
                    }
                ],
                grand_total: {
                    currency: 'USD',
                    value: 1434
                },
                subtotal: {
                    currency: 'USD',
                    value: 1234
                },
                total_tax: {
                    currency: 'USD',
                    value: 34
                },
                total_shipping: {
                    currency: 'USD',
                    value: 12
                }
            }
        },
        {
            billing_address: {
                city: 'Austin',
                country_code: 'US',
                firstname: 'Gooseton',
                lastname: 'Jr',
                postcode: '78759',
                region_id: 'TX',
                street: 'Goose Dr',
                telephone: '9123456789'
            },
            id: 2,
            invoices: [{ id: 1 }],
            items: [
                {
                    id: '3',
                    product_name: 'Product 3',
                    product_sale_price: '$100.00',
                    product_sku: 'VA03',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Blue'
                        }
                    ],
                    quantity_ordered: 1
                },
                {
                    id: '4',
                    product_name: 'Product 4',
                    product_sale_price: '$100.00',
                    product_sku: 'VP08',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Black'
                        }
                    ],
                    quantity_ordered: 1
                },
                {
                    id: '5',
                    product_name: 'Product 5',
                    product_sale_price: '$100.00',
                    product_sku: 'VSW09',
                    selected_options: [
                        {
                            label: 'Color',
                            value: 'Orange'
                        }
                    ],
                    quantity_ordered: 1
                }
            ],
            number: '000000005',
            order_date: '2020-05-26 18:22:35',
            payment_methods: [
                {
                    name: 'Braintree',
                    type: 'Credit Card',
                    additional_data: [
                        {
                            name: 'card_type',
                            value: 'Master Card'
                        },
                        {
                            name: 'last_four',
                            value: '7894'
                        }
                    ]
                }
            ],
            shipments: [
                {
                    id: '1',
                    tracking: [
                        {
                            carrier: 'Fedex',
                            number: 'FEDEX5885541235452125'
                        }
                    ]
                }
            ],
            shipping_address: {
                city: 'Austin',
                country_code: 'US',
                firstname: 'Gooseton',
                lastname: 'Jr',
                postcode: '78759',
                region_id: 'TX',
                street: 'Goose Dr',
                telephone: '9123456789'
            },
            shipping_method: 'Free',
            status: 'Complete',
            total: {
                discounts: [
                    {
                        amount: {
                            currency: 'USD',
                            value: 123
                        }
                    }
                ],
                grand_total: {
                    currency: 'USD',
                    value: 1434
                },
                subtotal: {
                    currency: 'USD',
                    value: 1234
                },
                total_tax: {
                    currency: 'USD',
                    value: 34
                },
                total_shipping: {
                    currency: 'USD',
                    value: 12
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
