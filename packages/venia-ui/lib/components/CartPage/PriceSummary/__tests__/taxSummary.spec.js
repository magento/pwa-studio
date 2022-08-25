import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import TaxSummary from '../taxSummary';

jest.mock('../../../../classify');

const defaultProps = {
    classes: {
        lineItemLabel: 'lineItemLabel',
        price: 'price'
    },
    data: [
        {
            amount: {
                value: 10,
                currency: 'USD'
            }
        }
    ]
};

test('renders tax summary line item correctly', () => {
    const tree = createTestInstance(<TaxSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders tax summary line item correctly if tax value is "0"', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                amount: {
                    value: 0,
                    currency: 'USD'
                }
            }
        ]
    };
    const tree = createTestInstance(<TaxSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders accumulated tax value', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                amount: {
                    value: 0,
                    currency: 'USD'
                }
            },
            {
                amount: {
                    value: 1,
                    currency: 'USD'
                }
            },
            {
                amount: {
                    value: 1,
                    currency: 'USD'
                }
            }
        ]
    };

    const tree = createTestInstance(<TaxSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if tax data is empty', () => {
    const props = {
        ...defaultProps,
        data: []
    };
    const tree = createTestInstance(<TaxSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
