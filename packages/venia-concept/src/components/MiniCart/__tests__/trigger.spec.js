import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Trigger from '../trigger';

const renderer = new ShallowRenderer();

test('renders the correct tree', () => {
    const props = {
        children: <span>Hi, I'm a child</span>
    };

    const tree = renderer.render(<Trigger {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders the correct tree when children not supplied', () => {
    const props = {};

    const tree = renderer.render(<Trigger {...props} />);

    expect(tree).toMatchSnapshot();
});
