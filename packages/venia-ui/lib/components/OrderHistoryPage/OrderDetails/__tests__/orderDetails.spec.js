import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import OrderDetails from '../orderDetails';

jest.mock('../billingInformation', () => props => (
    <div componentName="Billing Information" {...props} />
));
jest.mock('../shippingInformation', () => props => (
    <div componentName="Shipping Information Information" {...props} />
));
jest.mock('../shippingMethod', () => props => (
    <div componentName="Shipping Method" {...props} />
));
jest.mock('../paymentMethod', () => props => (
    <div componentName="Payment Method" {...props} />
));
jest.mock('../orderTotal', () => props => (
    <div componentName="Order Total" {...props} />
));
jest.mock('../items', () => props => <div componentName="Items" {...props} />);

const defaultProps = {
    imagesData: [
        {
            id: 1094,
            sku: 'VA03',
            thumbnail: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw01-rn_main_2.jpg'
            },
            url_key: 'valeria-two-layer-tank',
            url_suffix: '.html'
        },
        {
            id: 1103,
            sku: 'VP08',
            thumbnail: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw01-rn_main_2.jpg'
            },
            url_key: 'chloe-silk-shell',
            url_suffix: '.html'
        },
        {
            id: 1108,
            sku: 'VSW09',
            thumbnail: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw01-rn_main_2.jpg'
            },
            url_key: 'helena-cardigan',
            url_suffix: '.html'
        }
    ],
    orderData: {
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
};

const reducedProps = {
    imagesData: [],
    orderData: {
        billing_address: null,
        id: 'Ng==',
        invoices: [],
        items: [],
        number: '000000001',
        order_date: '2019-09-20 12:00:00',
        payment_methods: [],
        shipments: [],
        shipping_address: null,
        shipping_method: null,
        status: 'Received',
        total: {
            discounts: [],
            grand_total: {
                currency: null,
                value: 1000
            },
            subtotal: {
                currency: null,
                value: null
            },
            total_shipping: {
                currency: null,
                value: null
            },
            total_tax: {
                currency: null,
                value: null
            }
        }
    }
};

test('should render properly', () => {
    const tree = createTestInstance(<OrderDetails {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render with reduced order information', () => {
    const tree = createTestInstance(<OrderDetails {...reducedProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
