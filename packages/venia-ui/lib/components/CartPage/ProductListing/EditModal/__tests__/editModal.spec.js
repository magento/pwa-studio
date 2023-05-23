import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';

import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal'
);
jest.mock('../../../../../classify');
jest.mock('../../../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));
jest.mock('../productDetail', () => 'ProductDetail');
jest.mock('../productForm', () => 'ProductForm');

test('renders closed shell with no active item', () => {
    useEditModal.mockReturnValueOnce({
        handleClose: jest.fn(),
        isOpen: false
    });

    const tree = createTestInstance(
        <EditModal item={null} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders dialog form when active item is set up', () => {
    const mockItem = {
        id: '123',
        quantity: 5,
        configurable_options: ['option1', 'option2'],
        prices: {
            price: {
                currency: 'EUR',
                value: '456.78'
            }
        },
        product: {
            id: 123,
            name: 'Juno Sweater',
            sku: 'ABC',
            small_image: {
                url:
                    'https://master-7rqtwti-c5v7sxvquxwl4.eu-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/s/vsw02-pe_main_2.jpg'
            },
            stock_status: 'IN STOCK'
        }
    };

    useEditModal.mockReturnValueOnce({
        setVariantPrice: jest.fn(),
        variantPrice: ''
    });

    const tree = createTestInstance(
        <EditModal item={mockItem} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('if active edit item is not exist, dialog form is not visible', () => {
    const mockItem = null;

    useEditModal.mockReturnValueOnce({
        setVariantPrice: jest.fn(),
        variantPrice: ''
    });

    const tree = createTestInstance(
        <EditModal item={mockItem} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
