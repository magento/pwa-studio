import React from 'react';
import TestRenderer from 'react-test-renderer';

import Branch from '../categoryBranch';

jest.mock('src/classify');

const props = {
    name: 'a',
    path: '1/2/3'
};

test('renders the correct tree', () => {
    const tree = TestRenderer.create(<Branch {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('calls onDive on click', () => {
    const onDive = jest.fn();
    const { root } = TestRenderer.create(<Branch {...props} onDive={onDive} />);

    const button = root.findByProps({ className: 'root' });

    button.props.onClick();

    expect(onDive).toHaveBeenCalledTimes(1);
});
