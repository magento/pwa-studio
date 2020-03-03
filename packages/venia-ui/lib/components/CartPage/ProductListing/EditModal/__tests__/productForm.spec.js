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

test('renders loading indicator while options are being fetched', () => {
    useProductForm.mockReturnValueOnce({
        isLoading: true
    });

    const tree = createTestInstance(
        <ProductForm item={{}} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form with data', () => {
    const mockItem = {
        id: '123',
        quantity: 5,
        configurable_options: ['option1', 'option2']
    };

    useProductForm.mockReturnValueOnce({
        configItem: {
            configurable_options: ['option3', 'option4']
        },
        handleOptionSelection: jest.fn(),
        handleSubmit: jest.fn(),
        isLoading: false,
        setFormApi: jest.fn()
    });

    const tree = createTestInstance(
        <ProductForm item={mockItem} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
