import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MiniCart from '../miniCart';

const renderer = new ShallowRenderer();

test('renders the correct tree', () => {
    const props = {
        beginEditItem: jest.fn(),
        endEditItem: jest.fn(),
        cart: {
            isEditingItem: false
        }
    };

    const tree = renderer.render(<MiniCart {...props} />);

    expect(tree).toMatchSnapshot();
});
