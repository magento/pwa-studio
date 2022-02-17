import React from 'react';
import testRenderer from 'react-test-renderer';

import TileList from '../tileList';

jest.mock('../../../classify');
jest.mock('uuid', () => () => '00000000-0000-0000-0000-000000000000');

const defaultProps = {
    items: [
        {
            id: '1',
            label: 'foo'
        }
    ],
    getItemKey: jest.fn()
};

test('renders TileList component correctly', () => {
    const component = testRenderer.create(<TileList {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});
