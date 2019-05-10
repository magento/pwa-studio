import React from 'react';

import ThumbnailList from '../thumbnailList';
import {
    WindowSizeContextProvider,
    createTestInstance
} from '@magento/peregrine';
jest.mock('src/classify');

const updateActiveItemIndexMock = jest.fn();
const defaultProps = {
    activeItemIndex: 0,
    items: [
        {
            file: 'thumbnail1.png',
            label: 'test-thumbnail1'
        },
        {
            file: 'thumbnail2.png',
            label: 'test-thumbnail2'
        }
    ],
    updateActiveItemIndex: updateActiveItemIndexMock
};

test('renders the ThumbnailList component correctly', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <ThumbnailList {...defaultProps} />
        </WindowSizeContextProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('sets isActive on active thumbnail based on activeItemIndex', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <ThumbnailList {...defaultProps} />
        </WindowSizeContextProvider>
    );
    const tree = component.toJSON();
    expect(tree.children[defaultProps.activeItemIndex].props.className).toEqual(
        'rootSelected'
    );
});

test('calls updateActiveItemIndex with index of clicked thumbnail', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <ThumbnailList {...defaultProps} />
        </WindowSizeContextProvider>
    );

    const buttons = component.root.findAllByType('button');
    const inactiveThumbnail = buttons.find(
        button => button.props.className === 'root'
    );

    inactiveThumbnail.props.onClick();

    expect(updateActiveItemIndexMock).toHaveBeenCalledWith(1);

    updateActiveItemIndexMock.mockReset();
});
