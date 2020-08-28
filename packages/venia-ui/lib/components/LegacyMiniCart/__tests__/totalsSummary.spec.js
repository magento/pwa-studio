import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TotalsSummary from '../totalsSummary';

const renderer = new ShallowRenderer();

jest.mock('react-intl', () => {
    const props = { locale: 'en-US' };
    const useIntl = jest.fn(() => props);

    return { useIntl };
});

test('renders correctly when it has a subtotal', () => {
    const props = {
        subtotal: 99
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
