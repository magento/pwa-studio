import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TotalsSummary from '../totalsSummary';

const renderer = new ShallowRenderer();

test('renders correctly when it has a subtotal', () => {
    const props = {
        subtotal: 99,
        currencyCode: 'USD'
    };

    const tree = renderer.render(<TotalsSummary {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders an empty div when it does not have a subtotal', () => {
    const props = {
        subtotal: undefined
    };

    const tree = renderer.render(<TotalsSummary {...props} />);

    expect(tree).toMatchSnapshot();
});
