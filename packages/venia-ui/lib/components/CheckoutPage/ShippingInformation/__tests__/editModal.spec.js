import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal';

import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal'
);
jest.mock('../../../../classify');
jest.mock('../../../Modal', () => ({
    Modal: props => <modal-mock>{props.children}</modal-mock>
}));
jest.mock('../EditForm', () => 'EditForm');

const handleClose = jest.fn().mockName('handleClose');

test('renders open modal', () => {
    useEditModal.mockReturnValueOnce({
        handleClose,
        isOpen: true
    });

    const tree = createTestInstance(
        <EditModal shippingData={{ shipping: 'data' }} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders closed modal', () => {
    useEditModal.mockReturnValueOnce({
        handleClose,
        isOpen: false
    });

    const tree = createTestInstance(
        <EditModal shippingData={{ shipping: 'data' }} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
