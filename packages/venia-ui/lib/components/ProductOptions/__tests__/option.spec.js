import React from 'react';
import testRenderer from 'react-test-renderer';

import Option from '../option';

import SwatchList from '../swatchList';
import TileList from '../tileList';

jest.mock('../../../classify');
jest.mock('../../../util/getRandomColor');
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000');

const defaultProps = {
    attribute_id: '1',
    attribute_code: 'fashion_color',
    label: 'Color',
    values: [
        {
            label: 'red',
            value_index: 0
        },
        {
            label: 'blue',
            value_index: 1
        }
    ]
};

test('renders Option component correctly', () => {
    const component = testRenderer.create(<Option {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a SwatchList if attribute_code prop is "fashion_color"', () => {
    const component = testRenderer.create(<Option {...defaultProps} />);

    expect(() => {
        // findByType throws if not found.
        // @see https://reactjs.org/docs/test-renderer.html#testinstancefindbytype.
        component.root.findByType(SwatchList);
    }).not.toThrow();
});

test('renders a TileList if attribute_code prop is not "fashion_color"', () => {
    const props = {
        ...defaultProps,
        attribute_code: 'not_fashion_color'
    };
    const component = testRenderer.create(<Option {...props} />);

    expect(() => {
        // findByType throws if not found.
        // @see https://reactjs.org/docs/test-renderer.html#testinstancefindbytype.
        component.root.findByType(TileList);
    }).not.toThrow();
});
