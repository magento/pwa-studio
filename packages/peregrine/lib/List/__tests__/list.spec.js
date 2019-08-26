import React from 'react';

import List, { Items } from '..';
import createTestInstance from '../../util/createTestInstance';

const classes = {
    root: 'abc'
};

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

test('snapshot testing List component', () => {
    const tree = createTestInstance(
        <List
            classes={classes}
            items={items}
            getItemKey={getItemKey}
            selectionModel="radio"
            render="div"
            renderItem={renderItem}
            onSelectionChange={onSelectionChange}
        />
    );

    expect(tree.toTree()).toMatchSnapshot();
});

test('rerenders should not create new root element if props dint change', () => {
    const renderer = createTestInstance(<List items={items} render="div" />);
    const firstRoot = renderer.root.children[0];
    renderer.update(<List items={items} render="div" />);

    expect(firstRoot).toEqual(renderer.root.children[0]);
});

test('rerenders should create new root element if props change', () => {
    const renderer = createTestInstance(<List items={items} render="div" />);
    const firstRoot = renderer.root.children[0];
    renderer.update(<List items={items} render="ul" />);

    expect(firstRoot).not.toEqual(renderer.root.children[0]);
});

test('handleSelectionChange is memoized on onSelectionChange prop', () => {
    const renderer = createTestInstance(
        <List items={items} onSelectionChange={onSelectionChange} />
    );
    const firstHandleSelectionChange = renderer.root.findByType(Items).props
        .onSelectionChange;
    renderer.update(<List items={items} onSelectionChange={jest.fn()} />);

    expect(firstHandleSelectionChange).not.toEqual(
        renderer.root.findByType(Items).props.onSelectionChange
    );
});

test('renders the component provided using render prop as the container', () => {
    const Nav = () => <nav />;
    const instance = createTestInstance(<List items={items} render={Nav} />)
        .root;

    expect(instance.children[0].type).toEqual(Nav);
});
