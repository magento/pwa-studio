import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import { billingAddress } from '../__fixtures__/sampleValues';
import Summary from '../summary';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary',
    () => {
        return {
            useSummary: jest.fn().mockReturnValue({
                billingAddress: {},
                isBillingAddressSame: false
            })
        };
    }
);

test('Snapshot test', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: false,
        billingAddress
    });

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

test('Should render billing address if it is not same as shipping address', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: false,
        billingAddress
    });

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

    expect(
        tree.root.findByProps({
            id: 'addressSummary'
        })
    ).not.toBeNull();
});

test('Should not render billing address if it is same as shipping address', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: true,
        billingAddress: {}
    });

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

    expect(() => {
        tree.root.findByProps({
            id: 'addressSummary'
        });
    }).toThrow();
});
