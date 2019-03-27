import React from 'react';
import testRenderer from 'react-test-renderer';

import SwatchList from '../swatchList';

jest.mock('src/classify');
jest.mock('src/util/getRandomColor');
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000');

const defaultProps = {
    items: [
        {
            id: '1',
            value_index: 1,
            label: 'foo'
        }
    ]
};

test('renders SwatchList component correctly', () => {
    const component = testRenderer.create(<SwatchList {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});
