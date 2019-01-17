import React from 'react';
import TestRenderer from 'react-test-renderer';

import OrderItem from '../orderItem';

jest.mock('src/classify');

const itemMock = {
    id: 1,
    name: 'name',
    size: '43',
    color: 'color',
    qty: 1,
    titleImageSrc: 'picturePath',
    price: 10,
    sku: '24-MB01'
};

test('renders the expected tree', () => {
    const tree = TestRenderer.create(<OrderItem item={itemMock} />);

    expect(tree).toMatchSnapshot();
});

test('renders elements with classnames', () => {
    const { root } = TestRenderer.create(<OrderItem item={itemMock} />);

    expect(root.findByProps({ className: 'root' })).toBeTruthy();
    expect(root.findByProps({ className: 'main' })).toBeTruthy();
    expect(root.findByProps({ className: 'image' })).toBeTruthy();
    expect(root.findByProps({ className: 'propsList' })).toBeTruthy();
    expect(root.findByProps({ className: 'price' })).toBeTruthy();
    expect(root.findAllByProps({ className: 'propLabel' })).toHaveLength(4);
    expect(root.findAllByProps({ className: 'propValue' })).toHaveLength(4);
});
