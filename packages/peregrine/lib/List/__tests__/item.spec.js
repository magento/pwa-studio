import React from 'react';

import { Item } from '../index.js';
import createTestInstance from '../../util/createTestInstance';

const classes = { root: 'abc' };
const hasFocus = false;
const isSelected = false;
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
const itemIndex = 1;
const render = jest.fn(() => <div />);
const uniqueId = 1;

const props = {
    classes,
    hasFocus,
    isSelected,
    item,
    itemIndex,
    render,
    uniqueId
};

test('Item renders correctly', () => {
    const renderer = createTestInstance(<Item {...props} />);

    expect(renderer.toTree()).toMatchSnapshot();
});
