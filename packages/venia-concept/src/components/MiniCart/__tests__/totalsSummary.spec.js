import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TotalsSummary from '../totalsSummary';

const renderer = new ShallowRenderer();

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

    const tree = renderer.render(<TotalsSummary {...props} />);

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

    const tree = renderer.render(<TotalsSummary {...props} />);

    expect(tree).toMatchSnapshot();
});
