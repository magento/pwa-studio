import React from 'react';
import testRenderer from 'react-test-renderer';

import TileList from '../tileList';

jest.mock('src/classify');

const defaultProps = {
    items: [
        {
            id: '1',
            label: 'foo'
        }
    ]
};

test('renders TileList component correctly', () => {
    const component = testRenderer.create(<TileList {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});
