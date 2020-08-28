import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { IntlProvider } from 'react-intl';
import ShippingSummary from '../shippingSummary';

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
            selected_shipping_method: {
                amount: {
                    value: 10,
                    currency: 'USD'
                }
            }
        }
    ]
};

test('renders shipping summary line item correctly', () => {
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <ShippingSummary {...defaultProps} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders "FREE"" if shipping value is "0"', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                selected_shipping_method: {
                    amount: {
                        value: 0,
                        currency: 'USD'
                    }
                }
            }
        ]
    };
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <ShippingSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if shipping data is empty', () => {
    const props = {
        ...defaultProps,
        data: []
    };
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <ShippingSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders nothing if there is no selected shipping method', () => {
    const props = {
        ...defaultProps,
        data: [
            {
                // selected_shipping_method is returned once one is chosen.
            }
        ]
    };
    const tree = createTestInstance(
        <IntlProvider locale="en-US">
            <ShippingSummary {...props} />
        </IntlProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
