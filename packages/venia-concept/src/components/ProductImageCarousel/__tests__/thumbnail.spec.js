import React from 'react';
import testRenderer from 'react-test-renderer';

import Thumbnail from '../thumbnail';

jest.mock('src/classify');

const onClickHandler = jest.fn();
const itemIndex = 0;
const defaultProps = {
    isActive: true,
    item: {
        file: 'thumbnail.png',
        label: 'test-thumbnail'
    },
    itemIndex,
    onClickHandler
};

test('renders the Thumbnail component correctly', () => {
    const component = testRenderer.create(<Thumbnail {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('clicking calls click handler with item index', () => {
    const component = testRenderer.create(<Thumbnail {...defaultProps} />);

    component.root.findByType('button').props.onClick();

    expect(onClickHandler).toHaveBeenCalledWith(itemIndex);

    onClickHandler.mockClear();
});

test('renders transparent placeholder when no file name is provided', () => {
    const props = {
        ...defaultProps,
        item: {
            file: '',
            label: 'placeholder-thumbnail'
        }
    };
    const component = testRenderer.create(<Thumbnail {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders root class if not the active Thumbnail', () => {
    const props = {
        ...defaultProps,
        isActive: false
    };
    const component = testRenderer.create(<Thumbnail {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
    expect(component.root.findByType('button').props.className).toEqual('root');
});
