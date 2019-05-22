import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import TotalsSummary from '../totalsSummary';

test('renders correctly when it has a subtotal', () => {
    const props = {
        cart: {
            details: {
                currency: {
                    quote_currency_code: 'US'
                },
                items_qty: 1
            },
            totals: {
                subtotal: 99
            }
        }
    };

    const tree = createTestInstance(<TotalsSummary {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders an empty div when it does not have a subtotal', () => {
    const props = {
        cart: {
            details: {
                currency: {
                    quote_currency_code: 'US'
                },
                items_qty: 1
            },
            totals: {}
        }
    };

    const tree = createTestInstance(<TotalsSummary {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
