import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal';

import EditModal from '../editModal';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useEditModal',
    () => {
        return {
            useEditModal: () => ({
                isLoading: false,
                shouldRequestPaymentNonce: false,
                handleClose: () => {},
                handleUpdate: () => {},
                handlePaymentSuccess: () => {},
                handleDropinReady: () => {}
            })
        };
    }
);

test('Snapshot test', () => {
    const tree = createTestInstance(
        <EditModal selectedPaymentMethod="creditCard" />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
