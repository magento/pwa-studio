import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Trigger from '../trigger';

const renderer = new ShallowRenderer();

const baseProps = {
    action: jest.fn()
};

test('renders the correct tree', () => {
    const tree = renderer.render(<Trigger {...baseProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders children when supplied', () => {
    const props = {
        ...baseProps,
        children: ['Unit test child element']
    };

    const tree = renderer.render(<Trigger {...props} />);

    expect(tree).toMatchSnapshot();
});
