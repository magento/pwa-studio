import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { IntlProvider } from 'react-intl';
import ProductDetail from '../productDetail';

jest.mock('../../../../../classify');
jest.mock('../../../../Image', () => 'Image');
jest.mock('@magento/peregrine', () => {
    const Price = props => (
        <span>{`$${props.value} ${props.currencyCode}`}</span>
    );

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});

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

        const tree = createTestInstance(
            <IntlProvider locale="en-US">
                <ProductDetail item={item} />
            </IntlProvider>
        );
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
            <IntlProvider locale="en-US">
                <ProductDetail item={item} variantPrice={variantPrice} />
            </IntlProvider>
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

    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <ProductDetail item={item} />
        </IntlProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
