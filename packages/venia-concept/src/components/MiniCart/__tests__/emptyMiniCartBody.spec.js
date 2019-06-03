import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EmptyMiniCartBody from '../emptyMiniCartBody';

const renderer = new ShallowRenderer();

test('renders a "no items" message', () => {
    const tree = renderer.render(<EmptyMiniCartBody />);

    expect(tree).toMatchSnapshot();
});
