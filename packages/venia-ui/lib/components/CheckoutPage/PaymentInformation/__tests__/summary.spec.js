import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Summary from '../summary';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary',
    () => {
        return {
            useSummary: jest.fn().mockReturnValue({
                billingAddress: {
                    firstName: 'Goosey',
                    lastName: 'Goose',
                    country: 'Goose Land',
                    street1: '12345 Goosey Blvd',
                    street2: 'Apt 123',
                    city: 'Austin',
                    state: 'Texas',
                    postalCode: '12345',
                    phoneNumber: '1234657890'
                },
                isBillingAddressSame: false
            })
        };
    }
);

jest.mock('@apollo/react-hooks', () => {
    return {
        useQuery: jest
            .fn()
            .mockReturnValueOnce({
                data: {
                    cart: {
                        billingAddress: {
                            firstName: 'Goosey',
                            lastName: 'Goose',
                            country: 'Goose Land',
                            street1: '12345 Goosey Blvd',
                            street2: 'Apt 123',
                            city: 'Austin',
                            state: 'Texas',
                            postalCode: '12345',
                            phoneNumber: '1234657890'
                        }
                    }
                }
            })
            .mockReturnValueOnce({
                data: {
                    cart: {
                        isBillingAddressSame: false
                    }
                }
            })
            .mockReturnValue({ data: {} })
    };
});

test('Snapshot test', () => {
    const tree = createTestInstance(
        <Summary
            paymentNonce={{
                details: {
                    cardType: 'Visa',
                    lastFour: 'Ending in 1234'
                }
            }}
            onEdit={jest.fn()}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

// test('Should not render billing address if it is same as shipping address', () => {
//     useSummary.mockReturnValueOnce({
//         isBillingAddressSame: true,
//         billingAddress: {}
//     });

//     const tree = createTestInstance(<Summary />);

//     expect(tree.root.findByType);
// });
