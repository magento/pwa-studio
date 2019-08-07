import React from 'react';

import { Items, Item } from '..';
import createTestInstance from '../../util/createTestInstance';

const getItemKey = jest.fn(({ id }) => id);
const initialSelection = {};
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
const onSelectionChange = jest.fn();
const renderItem = jest.fn(() => <div />);
const selectionModel = 'radio';

const props = {
    getItemKey,
    initialSelection,
    items,
    onSelectionChange,
    renderItem,
    selectionModel
};

test('snapshot testing Items component', () => {
    const tree = createTestInstance(<Items {...props} />);

    expect(tree.toTree()).toMatchSnapshot();
});

test('creates an Item component for each item in items prop', () => {
    const instance = createTestInstance(<Items {...props} />).root;

    expect(instance.findAllByType(Item).length).toBe(items.length);
});

test('Item components are created in the exact same order as items prop', () => {
    const instance = createTestInstance(<Items {...props} />).root;

    instance.findAllByType(Item).forEach((ItemNode, index) => {
        expect(ItemNode.props.itemIndex).toBe(index);
    });
});

test('getItemKey is used to generate uniqueId for each of the items', () => {
    const instance = createTestInstance(<Items {...props} />).root;

    instance.findAllByType(Item).forEach((ItemNode, index) => {
        expect(ItemNode.props.uniqueId).toBe(items[index].id);
    });
});

test('if an initial selection is provided, the matching Item is selected', () => {
    const targetId = '001';
    const testProps = { ...props, ...{ initialSelection: { id: targetId } } };

    const instance = createTestInstance(<Items {...testProps} />).root;

    instance.findAllByType(Item).forEach(ItemNode => {
        const isTheTarget = ItemNode.props.uniqueId === targetId;

        expect(ItemNode.props.isSelected).toBe(isTheTarget);
    });
});
