import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductDetail from '../productDetail';

jest.mock('../../../../../classify');
jest.mock('../../../../Image', () => 'Image');

const mockProduct = {
    name: 'Simple Product',
    sku: 'SP-01',
    small_image: {
        url: 'https://test.cdn/image.jpg'
    }
};

const mockItem = {
    prices: {
        price: {
            currency: 'USD',
            value: 123.45
        }
    }
};

describe('renders product details', () => {
    test('with base price and in stock', () => {
        const item = {
            ...mockItem,
            product: {
                ...mockProduct,
                stock_status: 'IN_STOCK'
            }
        };

        const tree = createTestInstance(<ProductDetail item={item} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with variant price and out of stock', () => {
        const item = {
            ...mockItem,
            product: {
                ...mockProduct,
                stock_status: 'OUT_OF_STOCK'
            }
        };

        const variantPrice = {
            currency: 'EUR',
            value: '456.78'
        };

        const tree = createTestInstance(
            <ProductDetail item={item} variantPrice={variantPrice} />
        );
        expect(tree.toJSON()).toMatchSnapshot();
    });
});

test('renders product details with unknown stock value', () => {
    const item = {
        ...mockItem,
        product: {
            ...mockProduct,
            stock_status: 'Woof!'
        }
    };

    const tree = createTestInstance(<ProductDetail item={item} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
