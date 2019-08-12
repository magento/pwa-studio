import React from 'react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Leaf from '../categoryLeaf';

jest.mock('src/classify');

const props = {
    name: 'a',
    urlPath: '1/2/3'
};

test('renders the correct tree', () => {
    const tree = TestRenderer.create(
        <MemoryRouter>
            <Leaf {...props} />
        </MemoryRouter>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('calls onNavigate on link click', () => {
    const onNavigate = jest.fn();
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Leaf {...props} onNavigate={onNavigate} />
        </MemoryRouter>
    );

    const link = root.findByProps({ className: 'root' });

    link.props.onClick();

    expect(onNavigate).toHaveBeenCalledTimes(1);
});

test("doesn't call onNavigate if it's not a function", () => {
    const { root } = TestRenderer.create(
        <MemoryRouter>
            <Leaf {...props} />
        </MemoryRouter>
    );

    const link = root.findByProps({ className: 'root' });
    const callback = () => link.props.onClick();

    expect(callback).not.toThrow();
});
