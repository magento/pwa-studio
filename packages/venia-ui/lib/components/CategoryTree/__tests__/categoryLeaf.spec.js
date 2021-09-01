import React from 'react';
import { act } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import Leaf from '../categoryLeaf';

jest.mock('../../../classify');

const props = {
    category: {
        id: 1,
        name: 'One',
        url_path: 'one'
    },
    onNavigate: jest.fn(),
    categoryUrlSuffix: '.html'
};

test('renders correctly', () => {
    const instance = createTestInstance(
        <MemoryRouter>
            <Leaf {...props} />
        </MemoryRouter>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('constructs a valid url', () => {
    const { root } = createTestInstance(
        <MemoryRouter>
            <Leaf {...props} />
        </MemoryRouter>
    );

    const link = root.findByProps({ className: 'target' });

    expect(link.props.to).toBe('/one.html');
});

test('calls onNavigate on link click', () => {
    const { onNavigate } = props;
    const { root } = createTestInstance(
        <MemoryRouter>
            <Leaf {...props} />
        </MemoryRouter>
    );

    const link = root.findByProps({ className: 'target' });
    const { onClick } = link.props;

    act(() => {
        onClick();
    });

    expect(onNavigate).toHaveBeenCalledTimes(1);
});
