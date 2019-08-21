import React from 'react';

import { Items, Item } from '..';
import createTestInstance from '../../util/createTestInstance';

const items = [
    {
        id: '001',
        name: 'Test Product 1',
        small_image: '/test/product/1.png',
        price: {
            regularPrice: {
                amount: {
                    value: 100
                }
            }
        }
    },
    {
        id: '002',
        name: 'Test Product 2',
        small_image: '/test/product/2.png',
        price: {
            regularPrice: {
                amount: {
                    value: 100
                }
            }
        }
    }
];

const getItemKey = jest.fn(({ id }) => id);

const renderItem = jest.fn(() => <div />);

const onSelectionChange = jest.fn();

test('snapshot testing Items component', () => {
    const tree = createTestInstance(
        <Items
            items={items}
            getItemKey={getItemKey}
            renderItem={renderItem}
            selectionModel="radio"
            onSelectionChange={onSelectionChange}
        />
    );

    expect(tree.toTree()).toMatchSnapshot();
});

test('creates an item for each of the item`s objects', () => {
    const instance = createTestInstance(<Items items={items} />).root;

    expect(instance.findAllByType(Item).length).toBe(items.length);
});

test('getItemKey is used to generate uniqueID for each of the items', () => {
    const instance = createTestInstance(
        <Items items={items} getItemKey={({ id }) => id} />
    ).root;

    instance.findAllByType(Item).forEach((ItemNode, index) => {
        expect(ItemNode.props.uniqueID).toBe(items[index].id);
    });
});

test('Item components are created in the exact same order as items prop', () => {
    const instance = createTestInstance(<Items items={items} />).root;

    instance.findAllByType(Item).forEach((ItemNode, index) => {
        expect(ItemNode.props.itemIndex).toBe(index);
    });
});
