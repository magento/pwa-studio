import React from 'react';
import testRenderer from 'react-test-renderer';

import Option from '../option';

jest.mock('src/classify');
jest.mock('src/util/getRandomColor');
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000');

const onSelectionChangeMock = jest.fn();
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

    // TODO: Is there a better way to do typeof checks for HOC wrapped things?
    expect(
        component.root.children[0].instance.listComponent.displayName
    ).toContain('SwatchList');
});

test('renders a TileList if attribute_code prop is not "fashion_color"', () => {
    const props = {
        ...defaultProps,
        attribute_code: 'not_fashion_color'
    };
    const component = testRenderer.create(<Option {...props} />);

    // TODO: Is there a better way to do typeof checks for HOC wrapped things?
    expect(
        component.root.children[0].instance.listComponent.displayName
    ).toContain('TileList');
});

test('does not call onSelectionChange if not provided', () => {
    const component = testRenderer.create(<Option {...defaultProps} />);
    component.root.children[0].instance.handleSelectionChange('test');
    expect(onSelectionChangeMock).not.toHaveBeenCalled();

    onSelectionChangeMock.mockReset();
});

test('calls onSelectionChange function with attribute_id and selection', () => {
    const props = {
        ...defaultProps,
        onSelectionChange: onSelectionChangeMock
    };
    const component = testRenderer.create(<Option {...props} />);

    component.root.children[0].instance.handleSelectionChange('test');
    expect(onSelectionChangeMock).toHaveBeenCalledWith(
        defaultProps.attribute_id,
        'test'
    );

    onSelectionChangeMock.mockReset();
});
