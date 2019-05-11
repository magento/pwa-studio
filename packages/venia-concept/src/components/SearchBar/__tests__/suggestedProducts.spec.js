import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import mapProduct from '../mapProduct';
import SuggestedProduct from '../suggestedProduct';
import SuggestedProducts from '../suggestedProducts';

jest.mock('../mapProduct', () => jest.fn());
jest.mock('../suggestedProduct', () => () => null);

const products = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

test('renders correctly', () => {
    const subset = products.slice(0, 1);

    const instance = createTestInstance(
        <SuggestedProducts products={subset} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders a max of 3 products by default', () => {
    const { root } = createTestInstance(
        <SuggestedProducts products={products} />
    );

    expect(root.findAllByType(SuggestedProduct)).toHaveLength(3);
});

test('allows the render limit to be configured', () => {
    const { root } = createTestInstance(
        <SuggestedProducts limit={2} products={products} />
    );

    expect(root.findAllByType(SuggestedProduct)).toHaveLength(2);
});

test('calls `mapProduct()` for each item', () => {
    createTestInstance(<SuggestedProducts limit={4} products={products} />);

    products.forEach((product, index) => {
        expect(mapProduct).toHaveBeenNthCalledWith(1 + index, product);
    });
});
