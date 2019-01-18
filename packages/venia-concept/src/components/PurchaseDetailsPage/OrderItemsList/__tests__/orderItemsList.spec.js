import React from 'react';
import TestRenderer from 'react-test-renderer';

import OrderItemsList from '../OrderItemsList';

jest.mock('src/classify');

const itemsMock = [
    {
        id: 1,
        name: 'name',
        size: '42',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 27,
        sku: 'sku'
    },
    {
        id: 2,
        name: 'name',
        size: '42',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 27,
        sku: 'sku'
    }
];

test('renders the expected tree', () => {
    const tree = TestRenderer.create(
        <OrderItemsList title="a" items={itemsMock} />
    );

    expect(tree).toMatchSnapshot();
});

test('renders elements with classnames', () => {
    const { root } = TestRenderer.create(
        <OrderItemsList title="a" items={itemsMock} />
    );

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findByProps({ className: 'heading' })).toBeTruthy();
    expect(root.findByProps({ className: 'list' })).toBeTruthy();
});
