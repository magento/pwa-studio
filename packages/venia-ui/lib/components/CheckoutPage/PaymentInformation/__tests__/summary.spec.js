import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Summary from '../summary';

import classes from '../summary.css';

jest.mock('../../../../classify');

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary',
    () => {
        return {
            useSummary: jest.fn().mockReturnValue({
                billingAddress: {},
                isBillingAddressSame: false,
                paymentNonce: {}
            })
        };
    }
);

const billingAddress = {
    firstName: 'Goosey',
    lastName: 'Goose',
    country: 'Goose Land',
    street1: '12345 Goosey Blvd',
    street2: 'Apt 123',
    city: 'Austin',
    state: 'Texas',
    postalCode: '12345',
    phoneNumber: '1234657890'
};

test('Should return correct shape', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: false,
        billingAddress,
        paymentNonce: {
            details: { cardType: 'visa', lastFour: '1234' }
        }
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
        billingAddress,
        paymentNonce: {
            details: { cardType: 'visa', lastFour: '1234' }
        }
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
            className: classes.address_summary_container
        })
    ).not.toBeNull();
});

test('Should not render billing address if it is same as shipping address', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: true,
        billingAddress: {},
        paymentNonce: {
            details: { cardType: 'visa', lastFour: '1234' }
        }
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
            className: classes.address_summary_container
        });
    }).toThrow();
});

test('Should not render Edit text if isMobile is true', () => {
    useSummary.mockReturnValueOnce({
        isBillingAddressSame: true,
        billingAddress: {},
        paymentNonce: {
            details: { cardType: 'visa', lastFour: '1234' }
        }
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
            isMobile={true}
        />
    );

    expect(() => {
        tree.root.findByProps({
            className: classes.edit_text
        });
    }).toThrow();
});
