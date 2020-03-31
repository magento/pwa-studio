import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditModal } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal';

import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal'
);
jest.mock('../../../../../classify');
jest.mock('../../../../Modal', () => ({
    Modal: props => <modal-mock>{props.children}</modal-mock>
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

test('renders open drawer with active item', () => {
    const mockItem = {
        id: '123',
        name: 'Simple Product'
    };

    useEditModal.mockReturnValueOnce({
        handleClose: jest.fn(),
        isOpen: true
    });

    const tree = createTestInstance(
        <EditModal item={mockItem} setIsUpdating={jest.fn()} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
