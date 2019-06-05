import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Body from '../body';

const renderer = new ShallowRenderer();

const baseProps = {
    beginEditItem: jest.fn()
};

test('renders the product list when appropriate', () => {
    const tree = renderer.render(<Body {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders the loading indicator when appropriate', () => {
    const props = {
        ...baseProps,
        isLoading: true
    };

    const tree = renderer.render(<Body {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders the empty mini cart when appropriate', () => {
    const props = {
        ...baseProps,
        isCartEmpty: true
    };

    const tree = renderer.render(<Body {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders the edit item dialog when appropriate', () => {
    const props = {
        ...baseProps,
        isEditingItem: true
    };

    const tree = renderer.render(<Body {...props} />);

    expect(tree).toMatchSnapshot();
});
