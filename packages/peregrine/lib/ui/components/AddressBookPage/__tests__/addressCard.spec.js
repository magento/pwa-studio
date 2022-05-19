import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AddressCard from '../addressCard';

jest.mock('@magento/venia-ui/lib/classify');

const mockAddress = {
    city: 'New New York',
    country_code: 'US',
    default_shipping: true,
    firstname: 'Philip',
    lastname: 'Fry',
    postcode: '10019',
    region: { region: 'New York' },
    street: ['111 57th Street', 'Suite 1000'],
    telephone: '+12345678909'
};

const props = {
    address: mockAddress,
    countryName: 'United States',
    isConfirmingDelete: false,
    isDeletingCustomerAddress: false,
    onCancelDelete: jest.fn().mockName('onCancelDelete'),
    onConfirmDelete: jest.fn().mockName('onConfirmDelete'),
    onEdit: jest.fn().mockName('onEdit'),
    onDelete: jest.fn().mockName('onDelete')
};

test('renders a default address', () => {
    const tree = createTestInstance(<AddressCard {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a non-default address', () => {
    const tree = createTestInstance(
        <AddressCard
            {...props}
            address={{ ...mockAddress, default_shipping: false }}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders an address with a middle name', () => {
    // Arrange.
    const myAddress = {
        ...mockAddress,
        middlename: 'MIDDLE'
    };

    // Act.
    const tree = createTestInstance(
        <AddressCard {...props} address={myAddress} />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders delete confirmation if isConfirmingDelete is true', () => {
    const tree = createTestInstance(
        <AddressCard {...props} isConfirmingDelete={true} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders disabled delete confirmation if isConfirmingDelete and isDeletingCustomerAddress are true', () => {
    const tree = createTestInstance(
        <AddressCard
            {...props}
            isConfirmingDelete={true}
            isDeletingCustomerAddress={true}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
