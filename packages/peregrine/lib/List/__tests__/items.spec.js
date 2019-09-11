import React from 'react';

import { Items, Item } from '..';
import createTestInstance from '../../util/createTestInstance';

const getItemKey = jest.fn(({ id }) => id);
const initialSelection = null;
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

test('if an initial selection is provided, the matching Item is selected', () => {
    const targetId = '001';
    const testProps = { ...props, ...{ initialSelection: { id: targetId } } };

    const instance = createTestInstance(<Items {...testProps} />).root;

    const selectedItems = instance.findAllByType(Item).filter(ItemNode => {
        return ItemNode.props.isSelected;
    });
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].props.item.name).toBe('Test Product 1');
});

test('if an initial selection is not provided, no Items are selected', () => {
    const testProps = { ...props };

    const instance = createTestInstance(<Items {...testProps} />).root;

    const selectedItems = instance.findAllByType(Item).filter(ItemNode => {
        return ItemNode.props.isSelected;
    });
    expect(selectedItems).toHaveLength(0);
});

test('if an initial selection is provided, the matching Item is selected', () => {
    const targetId = '001';
    const testProps = { ...props, initialSelection: { id: targetId } };

    const instance = createTestInstance(<Items {...testProps} />).root;

    const selectedItems = instance.findAllByType(Item).filter(ItemNode => {
        return ItemNode.props.isSelected;
    });
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].props.item.name).toBe('Test Product 1');
});

test('if an initial selection is an array and the selectionModel is radio, only the first matching Item is selected', () => {
    const testProps = {
        ...props,
        initialSelection: [{ id: '001' }, { id: '002' }]
    };

    const instance = createTestInstance(<Items {...testProps} />).root;

    const selectedItems = instance.findAllByType(Item).filter(ItemNode => {
        return ItemNode.props.isSelected;
    });
    expect(selectedItems).toHaveLength(1);
});

test('if an initial selection is an array and the selectionMdoel is checkbox, all matching Items are selected', () => {
    const testProps = {
        ...props,
        initialSelection: [{ id: '001' }, { id: '002' }],
        selectionModel: 'checkbox'
    };

    const instance = createTestInstance(<Items {...testProps} />).root;

    const selectedItems = instance.findAllByType(Item).filter(ItemNode => {
        return ItemNode.props.isSelected;
    });
    expect(selectedItems).toHaveLength(2);
});
