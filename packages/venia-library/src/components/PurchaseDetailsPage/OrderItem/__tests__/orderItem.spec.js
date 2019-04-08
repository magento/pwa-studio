import React from 'react';
import TestRenderer from 'react-test-renderer';

import OrderItem from '../orderItem';
import classes from '../orderItem.css';

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

test('defaults price to 0', () => {
    const { price, ...customItemMock } = itemMock;

    const { root } = TestRenderer.create(<OrderItem item={customItemMock} />);

    void price;
    const element = root.findByProps({ className: 'price' }).children[0];

    expect(element.props.value).toBe(0);
});

test('calls onBuyItem with item', () => {
    const onBuyItem = jest.fn();

    const { root } = TestRenderer.create(
        <OrderItem item={itemMock} onBuyItem={onBuyItem} />
    );

    root.findByProps({ classes }).instance.buyItem();

    expect(onBuyItem).toHaveBeenCalledTimes(1);
    expect(onBuyItem).toHaveBeenLastCalledWith(itemMock);
});

test('calls onReviewItem with item', () => {
    const onReviewItem = jest.fn();

    const { root } = TestRenderer.create(
        <OrderItem item={itemMock} onReviewItem={onReviewItem} />
    );

    root.findByProps({ classes }).instance.reviewItem();

    expect(onReviewItem).toHaveBeenCalledTimes(1);
    expect(onReviewItem).toHaveBeenLastCalledWith(itemMock);
});

test('calls onShareItem with item', () => {
    const onShareItem = jest.fn();

    const { root } = TestRenderer.create(
        <OrderItem item={itemMock} onShareItem={onShareItem} />
    );

    root.findByProps({ classes }).instance.shareItem();

    expect(onShareItem).toHaveBeenCalledTimes(1);
    expect(onShareItem).toHaveBeenLastCalledWith(itemMock);
});
