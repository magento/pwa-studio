import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Button from '../button';
import ButtonGroup from '../buttonGroup';

jest.mock('../../../classify');
jest.mock('../button', () => 'Button');

test('renders a div', () => {
    const { root } = createTestInstance(<ButtonGroup />);

    const el = root.findByProps({ className: 'root' });

    expect(el).toBeTruthy();
});

test('renders children from `items`', () => {
    const items = [
        { key: 'a', children: 'a' },
        { key: 'b', children: 'b' },
        { key: 'c', children: 'c' }
    ];

    const { root } = createTestInstance(<ButtonGroup items={items} />);

    const el = root.findByProps({ className: 'root' });

    expect(el.children).toHaveLength(3);

    for (const child of el.children) {
        expect(child.type).toBe(Button);
    }
});
