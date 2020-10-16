import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import GiftCardSummary from '../giftCardSummary';

jest.mock('../../../../classify');

const defaultProps = {
    classes: {
        lineItemLabel: 'lineItemLabel',
        price: 'price'
    },
    data: [
        {
            applied_balance: {
                value: 10,
                currency: 'USD'
            }
        }
    ]
};

test('renders gift card summary line item correctly', () => {
    const tree = createTestInstance(<GiftCardSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders accumulated gift card value', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                applied_balance: {
                    value: 0,
                    currency: 'USD'
                }
            },
            {
                applied_balance: {
                    value: 1,
                    currency: 'USD'
                }
            },
            {
                applied_balance: {
                    value: 1,
                    currency: 'USD'
                }
            }
        ]
    };

    const tree = createTestInstance(<GiftCardSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if gift card data is empty', () => {
    const props = {
        ...defaultProps,
        data: []
    };
    const tree = createTestInstance(<GiftCardSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if gift card value is "0"', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                applied_balance: {
                    value: 0,
                    currency: 'USD'
                }
            }
        ]
    };
    const tree = createTestInstance(<GiftCardSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
