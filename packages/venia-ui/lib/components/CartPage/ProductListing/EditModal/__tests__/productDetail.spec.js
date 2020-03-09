import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useProductDetail } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductDetail';

import ProductDetail from '../productDetail';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductDetail'
);
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

test('renders product details', () => {
    useProductDetail.mockReturnValueOnce({
        currency: 'USD',
        name: 'Simple Product',
        imageURL: 'https://test.cdn/image.jpg',
        sku: 'SP-01',
        stockStatus: 'In Stock',
        unitPrice: 123.45
    });

    const tree = createTestInstance(<ProductDetail item={{}} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
