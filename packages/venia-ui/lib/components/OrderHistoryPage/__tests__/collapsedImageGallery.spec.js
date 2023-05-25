import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CollapsedImageGallery from '../collapsedImageGallery';

jest.mock('../../../classify');
jest.mock('../../Image', () => props => (
    <div componentName="Image" {...props} />
));

const defaultProps = {
    totalItemsCount: 5,
    displayCount: 4,
    items: [
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
        },
        {
            id: 1087,
            sku: 'VA05',
            thumbnail: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw01-rn_main_2.jpg'
            },
            url_key: 'valeria-two-layer-tank-new',
            url_suffix: '.html'
        },
        {
            id: 2094,
            sku: 'VA23',
            thumbnail: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw01-rn_main_2.jpg'
            },
            url_key: 'tank-top',
            url_suffix: '.html'
        }
    ]
};

test('renders empty container without image data', () => {
    const tree = createTestInstance(
        <CollapsedImageGallery
            {...{ totalItemsCount: 0, displayCount: 4, items: [] }}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders correctly with data', () => {
    test('without remainder', () => {
        const props = {
            totalItemsCount: 1,
            displayCount: 4,
            items: [defaultProps.items[0]]
        };
        const tree = createTestInstance(<CollapsedImageGallery {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with remainder', () => {
        const tree = createTestInstance(
            <CollapsedImageGallery {...defaultProps} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
