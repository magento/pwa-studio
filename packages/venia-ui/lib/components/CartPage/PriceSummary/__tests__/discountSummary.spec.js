import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import DiscountSummary from '../discountSummary';

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
            },
            label: 'Special rebate'
        }
    ]
};

test('renders discount summary line item correctly', () => {
    const tree = createTestInstance(<DiscountSummary {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders accumulated discount value', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                label: 'Discount 1',
                amount: {
                    value: 0,
                    currency: 'USD'
                }
            },
            {
                label: 'Discount 2',
                amount: {
                    value: 1,
                    currency: 'USD'
                }
            },
            {
                label: 'Discount 3',
                amount: {
                    value: 1,
                    currency: 'USD'
                }
            }
        ]
    };

    const tree = createTestInstance(<DiscountSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if discount data is empty', () => {
    const props = {
        ...defaultProps,
        data: []
    };
    const tree = createTestInstance(<DiscountSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if discount value is "0"', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                label: 'Discount 1',
                amount: {
                    value: 0,
                    currency: 'USD'
                }
            }
        ]
    };
    const tree = createTestInstance(<DiscountSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders discount label value from data ', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                amount: {
                    value: 1,
                    currency: 'USD'
                },
                label: 'Rebate'
            }
        ]
    };
    const tree = createTestInstance(<DiscountSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders "Discount applied" label if label data is empty', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                amount: {
                    value: 1,
                    currency: 'USD'
                }
            }
        ]
    };
    const tree = createTestInstance(<DiscountSummary {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
