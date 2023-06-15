import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';

import ProductForm from '../productForm';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm'
);
jest.mock('../../../../../classify');
jest.mock('../../../../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../../../../ProductOptions', () => 'Options');
jest.mock('../../../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));

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

const mockTalonProps = {
    configItem: {
        configurable_options: ['option3', 'option4']
    },
    errors: new Map(),
    handleOptionSelection: jest.fn(),
    handleSubmit: jest.fn(),
    outOfStockVariants: [[55, 56], [31]],
    isDialogOpen: true,
    isLoading: false,
    setFormApi: jest.fn()
};

const variantPrice = {
    currency: 'EUR',
    value: '456.78'
};

test('renders loading indicator while options are being fetched', () => {
    useProductForm.mockReturnValueOnce({
        ...mockTalonProps,
        isLoading: true
    });

    const tree = createTestInstance(
        <ProductForm item={null} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form with data', () => {
    useProductForm.mockReturnValueOnce(mockTalonProps);

    const tree = createTestInstance(
        <ProductForm
            item={mockItem}
            setIsUpdating={jest.fn()}
            setVariantPrice={jest.fn()}
            variantPrice={variantPrice}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form errors', () => {
    useProductForm.mockReturnValueOnce({
        ...mockTalonProps,
        errors: new Map([['error', new Error('Form Error')]])
    });

    const tree = createTestInstance(
        <ProductForm
            item={mockItem}
            setIsUpdating={jest.fn()}
            setVariantPrice={jest.fn()}
            variantPrice={variantPrice}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
