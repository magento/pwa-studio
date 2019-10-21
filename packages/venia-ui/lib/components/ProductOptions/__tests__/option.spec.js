import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Option from '../option';
import SwatchList from '../swatchList';
import TileList from '../tileList';

jest.mock('../../../classify');
jest.mock('../swatchList', () => () => <i />);
jest.mock('../tileList', () => () => <i />);

const defaultProps = {
    attribute_id: '1',
    attribute_code: 'foo',
    label: 'Foo',
    values: [
        {
            store_label: 'red',
            value_index: 0
        },
        {
            store_label: 'blue',
            value_index: 1
        }
    ]
};

test('renders Option component correctly', () => {
    const component = createTestInstance(<Option {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a SwatchList for color attributes', () => {
    const { root } = createTestInstance(
        <Option
            {...defaultProps}
            attribute_code="fashion_color"
            label="Fashion Color"
        />
    );

    expect(root.findByType(SwatchList)).toBeTruthy();
});

test('renders a Tile List for other attributes', () => {
    const { root } = createTestInstance(<Option {...defaultProps} />);

    expect(root.findByType(TileList)).toBeTruthy();
});

test('renders no selection at first', () => {
    const { root } = createTestInstance(<Option {...defaultProps} />);
    const selection = root.findByProps({ className: 'selection' });

    expect(selection.children).toHaveLength(2);
    expect(selection.children[1].children[0]).toBe('None');
});

test('renders selected value after selection', () => {
    const { root } = createTestInstance(<Option {...defaultProps} />);
    const { onSelectionChange } = root.findByType(TileList).props;
    const selection = root.findByProps({ className: 'selection' });

    expect(selection.children[1].children[0].includes('None')).toBeTruthy();

    act(() => {
        onSelectionChange(1);
    });

    expect(selection.children).toHaveLength(2);
    expect(selection.children[1].children[0].includes('blue')).toBeTruthy();
});

test('calls onSelectionChange callback on selection change', () => {
    const mockCallback = jest.fn();
    const { root } = createTestInstance(
        <Option {...defaultProps} onSelectionChange={mockCallback} />
    );
    const { onSelectionChange } = root.findByType(TileList).props;
    const nextSelection = 1;

    act(() => {
        onSelectionChange(nextSelection);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(1, '1', nextSelection);
});
