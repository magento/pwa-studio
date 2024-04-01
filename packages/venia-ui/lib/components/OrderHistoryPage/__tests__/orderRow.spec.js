import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';

import OrderRow from '../orderRow';

jest.mock('@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow');

jest.mock('../../../classify');
jest.mock('../collapsedImageGallery', () => props => (
    <div componentName="CollapsedImageGallery" {...props} />
));
jest.mock('../orderProgressBar', () => props => (
    <div componentName="OrderProgressBar" {...props} />
));
jest.mock('../OrderDetails', () => props => (
    <div componentName="Order Details" {...props} />
));
jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    ),
    useIntl: jest.fn().mockReturnValue({
        formatMessage: jest
            .fn()
            .mockImplementation(options => options.defaultMessage)
    })
}));

const mockOrder = {
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
};

const imagesData = [
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
];

test('it renders collapsed order row', () => {
    useOrderRow.mockReturnValue({
        loading: false,
        imagesData,
        isOpen: false,
        handleContentToggle: jest.fn().mockName('handleContentToggle')
    });

    const tree = createTestInstance(<OrderRow order={mockOrder} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it does not render order details if loading is true', () => {
    useOrderRow.mockReturnValue({
        loading: true,
        imagesData,
        isOpen: false,
        handleContentToggle: jest.fn().mockName('handleContentToggle')
    });

    const tree = createTestInstance(<OrderRow order={mockOrder} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders open order row', () => {
    useOrderRow.mockReturnValue({
        loading: false,
        imagesData,
        isOpen: true,
        handleContentToggle: jest.fn().mockName('handleContentToggle')
    });

    const orderWithShipment = {
        ...mockOrder,
        shipments: [1]
    };
    const tree = createTestInstance(<OrderRow order={orderWithShipment} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders with missing order information', () => {
    useOrderRow.mockReturnValue({
        loading: false,
        imagesData,
        isOpen: false,
        handleContentToggle: jest.fn()
    });

    const receivedOrder = {
        ...mockOrder,
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
    };

    const tree = createTestInstance(<OrderRow order={receivedOrder} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
