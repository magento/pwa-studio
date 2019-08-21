import React from 'react';

import { Item } from '../index.js';
import createTestInstance from '../../util/createTestInstance';

const item = {
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
};

const classes = {
    root: 'abc'
};

const hasFocus = jest.fn();

const render = jest.fn(() => <div />);

const updateSelection = jest.fn();

const setFocus = jest.fn();

test('snapshot testing Item', () => {
    const renderer = createTestInstance(
        <Item
            uniqueID="001"
            classes={classes}
            hasFocus={hasFocus}
            isSelected={false}
            item={item}
            itemIndex={0}
            render={render}
            updateSelection={updateSelection}
            setFocus={setFocus}
        />
    );

    expect(renderer.toTree()).toMatchSnapshot();
});

test('onClick function is memoized on updateSelection prop', () => {
    const renderer = createTestInstance(
        <Item item={item} updateSelection={updateSelection} />
    );
    const firstOnClick = renderer.root.children[0].props.onClick;
    renderer.update(<Item item={item} updateSelection={updateSelection} />);

    expect(firstOnClick).toEqual(renderer.root.children[0].props.onClick);

    renderer.update(<Item item={item} updateSelection={jest.fn()} />);

    expect(firstOnClick).not.toEqual(renderer.root.children[0].props.onClick);
});

test('onFocus function is memoized on setFocus prop', () => {
    const renderer = createTestInstance(
        <Item item={item} setFocus={setFocus} />
    );
    const firstOnFocus = renderer.root.children[0].props.onFocus;
    renderer.update(<Item item={item} setFocus={setFocus} />);

    expect(firstOnFocus).toEqual(renderer.root.children[0].props.onFocus);

    renderer.update(<Item item={item} setFocus={jest.fn()} />);

    expect(firstOnFocus).not.toEqual(renderer.root.children[0].props.onFocus);
});
