import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Header from '../header';

const renderer = new ShallowRenderer();

test('it renders the correct tree', () => {
    const props = {
        isEditingItem: false
    };

    const tree = renderer.render(<Header {...props} />);

    expect(tree).toMatchSnapshot();
});

test('it renders a different title while editing', () => {
    const props = {
        isEditingItem: true
    };

    renderer.render(<Header {...props} />);
    const result = renderer.getRenderOutput();

    const headerTag = result.props.children[0];
    const title = headerTag.props.children;

    expect(title).toBe('Edit Cart Item');
});
