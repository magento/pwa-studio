/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const SimpleProduct = {
    product: {
        sku: '24-WG088',
        name: 'Sprite Foam Roller',
        canonical_url:
            'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/sprite-foam-roller.html'
    },
    productView: {
        __typename: 'SimpleProductView',
        sku: '24-WG088',
        name: 'Sprite Foam Roller',
        url:
            'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/sprite-foam-roller.html',
        urlKey: 'sprite-foam-roller',
        images: [
            {
                label: 'Image',
                url:
                    'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/media/catalog/product/l/u/luma-foam-roller.jpg'
            }
        ],
        price: {
            final: {
                amount: {
                    value: 19.0,
                    currency: 'USD'
                }
            },
            regular: {
                amount: {
                    value: 19.0,
                    currency: 'USD'
                }
            }
        }
    },
    highlights: [
        {
            attribute: 'name',
            value: '<em>Sprite</em> Foam Roller',
            matched_words: []
        }
    ]
};

const ComplexProduct = {
    product: {
        sku: 'MSH06',
        name: 'Lono Yoga Short',
        canonical_url:
            'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/lono-yoga-short.html'
    },
    productView: {
        __typename: 'ComplexProductView',
        sku: 'MSH06',
        name: 'Lono Yoga Short',
        url:
            'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/lono-yoga-short.html',
        urlKey: 'lono-yoga-short',
        images: [
            {
                label: '',
                url:
                    'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/media/catalog/product/m/s/msh06-gray_main_2.jpg'
            },
            {
                label: '',
                url:
                    'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/media/catalog/product/m/s/msh06-gray_alt1_2.jpg'
            },
            {
                label: '',
                url:
                    'http://master-7rqtwti-grxawiljl6f4y.us-4.magentosite.cloud/media/catalog/product/m/s/msh06-gray_back_2.jpg'
            }
        ],
        priceRange: {
            maximum: {
                final: {
                    amount: {
                        value: 32.0,
                        currency: 'USD'
                    }
                },
                regular: {
                    amount: {
                        value: 32.0,
                        currency: 'USD'
                    }
                }
            },
            minimum: {
                final: {
                    amount: {
                        value: 32.0,
                        currency: 'USD'
                    }
                },
                regular: {
                    amount: {
                        value: 32.0,
                        currency: 'USD'
                    }
                }
            }
        },
        options: [
            {
                id: 'size',
                title: 'Size',
                values: [
                    {
                        title: '32',
                        id: 'Y29uZmlndXJhYmxlLzE4Ni8xODQ=',
                        type: 'TEXT',
                        value: '32'
                    },
                    {
                        title: '33',
                        id: 'Y29uZmlndXJhYmxlLzE4Ni8xODU=',
                        type: 'TEXT',
                        value: '33'
                    },
                    {
                        title: '34',
                        id: 'Y29uZmlndXJhYmxlLzE4Ni8xODY=',
                        type: 'TEXT',
                        value: '34'
                    },
                    {
                        title: '36',
                        id: 'Y29uZmlndXJhYmxlLzE4Ni8xODc=',
                        type: 'TEXT',
                        value: '36'
                    }
                ]
            },
            {
                id: 'color',
                title: 'Color',
                values: [
                    {
                        title: 'Blue',
                        id: 'Y29uZmlndXJhYmxlLzkzLzU5',
                        type: 'COLOR_HEX',
                        value: '#1857f7'
                    },
                    {
                        title: 'Red',
                        id: 'Y29uZmlndXJhYmxlLzkzLzY3',
                        type: 'COLOR_HEX',
                        value: '#ff0000'
                    },
                    {
                        title: 'Gray',
                        id: 'Y29uZmlndXJhYmxlLzkzLzYx',
                        type: 'COLOR_HEX',
                        value: '#8f8f8f'
                    }
                ]
            }
        ]
    },
    highlights: [
        {
            attribute: 'name',
            value: 'Lono <em>Yoga</em> Short',
            matched_words: []
        }
    ]
};

export const products = [
    SimpleProduct,
    SimpleProduct,
    SimpleProduct,
    SimpleProduct,
    SimpleProduct,
    SimpleProduct,
    ComplexProduct
];
