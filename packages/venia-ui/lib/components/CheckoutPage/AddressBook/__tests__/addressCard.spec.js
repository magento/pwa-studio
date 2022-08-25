import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddressCard } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressCard';

import AddressCard from '../addressCard';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressCard'
);
jest.mock('../../../../classify');

const mockAddress = {
    city: 'Manhattan',
    country_code: 'US',
    default_shipping: true,
    firstname: 'Philip',
    lastname: 'Fry',
    postcode: '10019',
    region: { region: 'NY' },
    street: ['3000 57th Street', 'Suite 200'],
    telephone: '(123) 456-7890'
};

const talonProps = {
    handleClick: jest.fn().mockName('handleClick'),
    handleEditAddress: jest.fn().mockName('handleEditAddress'),
    handleKeyPress: jest.fn().mockName('handleKeyPress'),
    hasUpdate: false
};

test('renders base card state', () => {
    useAddressCard.mockReturnValueOnce(talonProps);

    const tree = createTestInstance(
        <AddressCard address={mockAddress} isSelected={false} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders selected card state', () => {
    useAddressCard.mockReturnValueOnce(talonProps);

    const tree = createTestInstance(
        <AddressCard
            address={{ ...mockAddress, default_shipping: false }}
            isSelected={true}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders updated card state', () => {
    useAddressCard.mockReturnValueOnce({ ...talonProps, hasUpdate: true });

    const tree = createTestInstance(
        <AddressCard address={mockAddress} isSelected={true} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
