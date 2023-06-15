import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Items from '../items';

jest.mock('../item', () => props => (
    <div componentName="Item Component" {...props} />
));

const defaultProps = {
    data: {
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
        items: [
            {
                id: '3',
                product_name: 'Product 3',
                product_sale_price: '$100.00',
                product_sku: 'VA03',
                product_url_key: 'valeria-two-layer-tank',
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
                product_url_key: 'chloe-silk-shell',
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
                product_url_key: 'helena-cardigan',
                selected_options: [
                    {
                        label: 'Color',
                        value: 'Orange'
                    }
                ],
                quantity_ordered: 1
            }
        ]
    }
};

test('should render properly', () => {
    const tree = createTestInstance(<Items {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
