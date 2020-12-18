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

test('renders a default address', () => {
    const tree = createTestInstance(
        <AddressCard address={mockAddress} countryName="United States" />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a non-default address', () => {
    const tree = createTestInstance(
        <AddressCard address={{ ...mockAddress, default_shipping: false }} />
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
        <AddressCard address={myAddress} countryName="United States" />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
