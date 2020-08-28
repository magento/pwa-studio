import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { IntlProvider } from 'react-intl';
import DiscountSummary from '../discountSummary';

jest.mock('../../../../classify');

jest.mock('@magento/peregrine', () => {
    const Price = props => <span>{`$${props.value}`}</span>;

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});

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

test('renders discount summary line item correctly', () => {
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <DiscountSummary {...defaultProps} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders accumulated discount value', () => {
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

    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <DiscountSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if discount data is empty', () => {
    const props = {
        ...defaultProps,
        data: []
    };
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <DiscountSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if discount value is "0"', () => {
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
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <DiscountSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
