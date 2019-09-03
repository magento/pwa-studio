import React from 'react';

import List, { Items } from '..';
import createTestInstance from '../../util/createTestInstance';

const classes = { root: 'abc' };
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
const render = 'div';
const renderItem = jest.fn(() => <div />);
const selectionModel = 'radio';

const props = {
    classes,
    getItemKey,
    initialSelection,
    items,
    render,
    renderItem,
    onSelectionChange,
    selectionModel
};

test('List component renders correctly', () => {
    const tree = createTestInstance(<List {...props} />);

    expect(tree.toTree()).toMatchSnapshot();
});

test('rerenders should not create new root element if props didnt change', () => {
    const renderer = createTestInstance(<List {...props} />);

    const firstRoot = renderer.root.children[0];
    renderer.update(<List {...props} />);

    expect(firstRoot).toEqual(renderer.root.children[0]);
});

test('rerenders should create new root element if props change', () => {
    const renderer = createTestInstance(<List {...props} />);

    const firstRoot = renderer.root.children[0];

    const updateProps = { ...props, render: 'ul' };
    renderer.update(<List {...updateProps} />);

    expect(firstRoot).not.toEqual(renderer.root.children[0]);
});

test('handleSelectionChange is memoized on onSelectionChange prop', () => {
    const renderer = createTestInstance(<List {...props} />);

    const firstHandleSelectionChange = renderer.root.findByType(Items).props
        .onSelectionChange;

    const updateProps = { ...props, onSelectionChange: jest.fn() };
    renderer.update(<List {...updateProps} />);

    const secondHandleSelectionChange = renderer.root.findByType(Items).props
        .onSelectionChange;
    expect(firstHandleSelectionChange).not.toEqual(secondHandleSelectionChange);
});

test('renders the component provided using render prop as the container', () => {
    const Nav = () => <nav />;
    const testProps = { ...props, render: Nav };
    const instance = createTestInstance(<List {...testProps} />).root;

    expect(instance.children[0].type).toEqual(Nav);
});

test('passes the initial selection to Items', () => {
    const initialSelection = { name: 'first' };
    const testProps = { ...props, initialSelection };

    const renderer = createTestInstance(<List {...testProps} />);
    const instance = renderer.root;

    const expected = initialSelection;
    const actual = instance.findByType(Items).props.initialSelection;
    expect(actual).toEqual(expected);
});
