import React from 'react';
import ShallowRenderer from 'react-test-renderer/Shallow';

import EmptyMiniCart from '../emptyMiniCart';

const renderer = new ShallowRenderer();

test('renders a "no items" message', () => {
    const tree = renderer.render(<EmptyMiniCart />);

    expect(tree).toMatchSnapshot();
});
