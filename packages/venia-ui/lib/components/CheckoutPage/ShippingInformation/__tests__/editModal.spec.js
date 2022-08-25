import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal';

import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal'
);
jest.mock('../../../../classify');
jest.mock('../../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));
jest.mock('../AddressForm', () => 'AddressForm');

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
