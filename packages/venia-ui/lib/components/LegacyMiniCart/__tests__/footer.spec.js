import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Footer from '../footer';

const renderer = new ShallowRenderer();

const baseProps = {
    isCartEmpty: false,
    isMiniCartMaskOpen: false
};

test('renders the correct tree', () => {
    const tree = renderer.render(<Footer {...baseProps} />);

    expect(tree).toMatchSnapshot();
});
