import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import OrderTotal from '../orderTotal';

const defaultProps = {
    data: {
        discounts: [
            {
                amount: {
                    currency: 'USD',
                    value: 62
                }
            },
            {
                amount: {
                    currency: 'USD',
                    value: 61
                }
            }
        ],
        grand_total: {
            currency: 'USD',
            value: 1434
        },
        subtotal: {
            currency: 'USD',
            value: 1234
        },
        total_tax: {
            currency: 'USD',
            value: 34
        },
        total_shipping: {
            currency: 'USD',
            value: 12
        }
    }
};

test('should render properly', () => {
    const tree = createTestInstance(<OrderTotal {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('should conditionally render discount row', () => {
    const props = {
        data: {
            ...defaultProps.data,
            discounts: null
        }
    };
    const tree = createTestInstance(<OrderTotal {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
