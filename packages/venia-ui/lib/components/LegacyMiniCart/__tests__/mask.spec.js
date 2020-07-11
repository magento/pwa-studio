import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MiniCartMask from '../mask';

const renderer = new ShallowRenderer();

test('it renders the shared Mask component', () => {
    const tree = renderer.render(<MiniCartMask />);

    expect(tree).toMatchSnapshot();
});
