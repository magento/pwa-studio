import React from 'react';
import TestRenderer from 'react-test-renderer';

import Button from '../button';
import ButtonGroup from '../buttonGroup';

jest.mock('src/classify');
jest.mock('../button');

test('renders a div', () => {
    const { root } = TestRenderer.create(<ButtonGroup />);

    const el = root.findByProps({ className: 'root' });

    expect(el).toBeTruthy();
});

test('renders children from `items`', () => {
    const items = [
        { key: 'a', children: 'a' },
        { key: 'b', children: 'b' },
        { key: 'c', children: 'c' }
    ];

    const { root } = TestRenderer.create(<ButtonGroup items={items} />);

    const el = root.findByProps({ className: 'root' });

    expect(el.children).toHaveLength(3);

    for (const child of el.children) {
        expect(child.type).toBe(Button);
    }
});
