import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useBillingAddress } from '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/useBillingAddress';
import Country from '@magento/venia-ui/lib/components/Country';

import BillingAddress from '../billingAddress';

import classes from '../billingAddress.module.css';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/useBillingAddress',
    () => {
        return {
            useBillingAddress: jest.fn().mockReturnValue({
                isBillingAddressSame: false,
                errors: new Map(),
                initialValues: {
                    firstName: 'sample first name',
                    lastName: 'sample last name',
                    city: 'sample city',
                    region: 'sample region',
                    country: 'sample country',
                    street1: 'sample street 1',
                    street2: 'sample street 2',
                    postcode: 'sample postal code',
                    phoneNumber: 'sample phone number',
                    isBillingAddressSame: false
                },
                shippingAddressCountry: 'US'
            })
        };
    }
);

jest.mock('@magento/venia-ui/lib/components/FormError', () => 'FormError');

jest.mock('@magento/venia-ui/lib/components/Checkbox', () => {
    return props => <mock-Checkbox {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/Field', () => {
    return props => <mock-Field {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/TextInput', () => {
    return props => <mock-TextInput {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/Country', () => {
    return props => <mock-Country {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/Region', () => {
    return props => <mock-Region {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/Postcode', () => {
    return props => <mock-Postcode {...props} />;
});

const useBillingAddressReturnValue = {
    isBillingAddressSame: false,
    errors: new Map(),
    initialValues: {
        firstName: 'sample first name',
        lastName: 'sample last name',
        city: 'sample city',
        region: 'sample region',
        country: 'sample country',
        street1: 'sample street 1',
        street2: 'sample street 2',
        postcode: 'sample postal code',
        phoneNumber: 'sample phone number',
        isBillingAddressSame: false
    },
    shippingAddressCountry: 'US'
};

test('Should return correct shape', () => {
    useBillingAddress.mockReturnValueOnce({
        ...useBillingAddressReturnValue
    });

    const tree = createTestInstance(<BillingAddress />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Billing address fields should not be visible if isBillingAddressSame is true', () => {
    useBillingAddress.mockReturnValueOnce({
        ...useBillingAddressReturnValue,
        isBillingAddressSame: true
    });

    const tree = createTestInstance(<BillingAddress />);

    expect(
        tree.root.findByProps({
            className: classes.billing_address_fields_root_hidden
        })
    ).not.toBeNull();
});

test('Should render error messages if errors array is not empty', () => {
    useBillingAddress.mockReturnValueOnce({
        ...useBillingAddressReturnValue,
        formErrors: [new Error('something is missing')]
    });

    const tree = createTestInstance(<BillingAddress />);

    expect(tree.root.findByType('FormError')).not.toBeNull();
});

test('Should use country from shipping address if initialValues is empty', () => {
    useBillingAddress.mockReturnValueOnce({
        ...useBillingAddressReturnValue,
        isBillingAddressSame: false,
        initialValues: {},
        shippingAddressCountry: 'UK'
    });

    const tree = createTestInstance(<BillingAddress />);

    expect(tree.root.findByType(Country).props.initialValue).toBe('UK');
});
