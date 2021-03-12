import React from 'react';

import { useQuery } from '@apollo/client';

import { useSummary } from '../useSummary';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn().mockReturnValue({
        cache: {
            policies: {
                addTypePolicies: jest.fn()
            }
        }
    }),
    useQuery: jest.fn().mockReturnValueOnce({
        loading: false,
        data: {
            cart: {
                billingAddress: {
                    firstName: 'Goosey',
                    lastName: 'Goose',
                    country: { code: 'United States of Gooseland' },
                    street: ['12345 Gooseey Blvd', 'Apt 123'],
                    city: { code: 'Goostin' },
                    region: 'Gooseyork',
                    postalCode: '12345',
                    phoneNumber: '1234567890'
                },
                isBillingAddressSame: false,
                paymentNonce: { code: 'braintree', title: 'Braintree' }
            }
        }
    })
}));

const Component = props => {
    const talonProps = useSummary(props);

    return <i talonProps={talonProps} />;
};

test('Should return correct shape', () => {
    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('mapBillingAddressData() should return an empty object if the raw billing address data is empty', () => {
    useQuery.mockReturnValueOnce({
        loading: false,
        data: {
            cart: {
                isBillingAddressSame: false,
                paymentNonce: { code: 'braintree', title: 'Braintree' }
            }
        }
    });

    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.billingAddress).toEqual({});
});

test('handles empty summary data returned from query', () => {
    useQuery.mockReturnValueOnce({
        loading: false
    });

    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.billingAddress).toEqual({});
    expect(talonProps.paymentNonce).toBeNull();
    expect(talonProps.selectedPaymentMethod).toBeNull();
    expect(talonProps.isBillingAddressSame).toBeTruthy();
});
