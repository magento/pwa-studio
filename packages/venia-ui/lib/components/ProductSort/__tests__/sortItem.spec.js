import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SortItem from '../sortItem';

const mockOnClick = jest.fn();

const defaultProps = {
    active: false,
    onClick: mockOnClick,
    sortItem: {
        id: 'foo',
        text: 'relevance'
    }
};

const Component = () => <SortItem {...defaultProps} />;

test('renders correctly', () => {
    const instance = createTestInstance(<Component />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('calls onCLick handler onMouseDown', () => {
    const component = createTestInstance(<Component />);
    const { root } = component;

    root.findByType('button').props.onMouseDown();
    expect(mockOnClick).toHaveBeenCalled();
});

test('calls onCLick handler on keyboard Enter or space press', () => {
    const component = createTestInstance(<Component />);
    const { root } = component;

    root.findByType('button').props.onKeyDown({
        key: 'Enter',
        preventDefault: jest.fn()
    });

    root.findByType('button').props.onKeyDown({
        key: ' ',
        preventDefault: jest.fn()
    });

    expect(mockOnClick).toHaveBeenCalledTimes(2);
});
