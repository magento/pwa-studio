import React from 'react';
import testRenderer from 'react-test-renderer';

import Tile from '../tile';

jest.mock('src/classify');
jest.mock('src/util/getRandomColor');
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000');

const defaultProps = {
    item: {
        label: 'red',
        value_index: 0
    }
};

test('renders a Tile correctly', () => {
    const component = testRenderer.create(<Tile {...defaultProps} />);

    expect(component.root.findByType('button').props.className).not.toContain(
        '_selected'
    );

    expect(component.root.findByType('button').props.className).not.toContain(
        '_focused'
    );
    expect(component).toMatchSnapshot();
});

test('appends "_selected" to className if isSelected is true', () => {
    const props = {
        ...defaultProps,
        isSelected: true
    };

    const component = testRenderer.create(<Tile {...props} />);

    expect(component.root.findByType('button').props.className).toContain(
        '_selected'
    );

    expect(component).toMatchSnapshot();
});

test('appends "_focused" to className if hasFocus is true', () => {
    const props = {
        ...defaultProps,
        hasFocus: true
    };
    const component = testRenderer.create(<Tile {...props} />);

    expect(component.root.findByType('button').props.className).toContain(
        '_focused'
    );

    expect(component).toMatchSnapshot();
});
