import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';

import ShippingInformation from '../shippingInformation';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation'
);
jest.mock('../../../../classify');

jest.mock('../../../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../card', () => 'Card');
jest.mock('../AddressForm', () => 'AddressForm');
jest.mock('../editModal', () => 'EditModal');

test('renders loading element', () => {
    useShippingInformation.mockReturnValueOnce({
        doneEditing: false,
        isLoading: true
    });

    const tree = createTestInstance(<ShippingInformation onSave={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders card state with guest data', () => {
    useShippingInformation.mockReturnValueOnce({
        doneEditing: true,
        handleEditShipping: jest.fn().mockName('handleEditShipping'),
        isLoading: false,
        shippingData: 'Shipping Data'
    });

    const tree = createTestInstance(<ShippingInformation onSave={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders card state with customer data', () => {
    useShippingInformation.mockReturnValueOnce({
        doneEditing: true,
        handleEditShipping: jest.fn().mockName('handleEditShipping'),
        isLoading: false,
        isSignedIn: true,
        shippingData: 'Shipping Data'
    });

    const tree = createTestInstance(<ShippingInformation onSave={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form state without data', () => {
    useShippingInformation.mockReturnValueOnce({
        doneEditing: false,
        isLoading: false,
        shippingData: 'Shipping Data'
    });

    const tree = createTestInstance(<ShippingInformation onSave={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
