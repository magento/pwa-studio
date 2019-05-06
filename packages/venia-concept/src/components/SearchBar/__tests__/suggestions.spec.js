import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Suggestions from '../suggestions';

jest.mock('../suggestedCategories', () => () => null);
jest.mock('../suggestedProducts', () => () => null);

const filters = [
    { name: 'Color', filter_items: [] },
    { name: 'Category', filter_items: [] }
];

test('renders correctly', () => {
    const products = {
        filters: [],
        items: []
    };

    const instance = createTestInstance(
        <Suggestions products={products} visible={true} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders null if there are no items', () => {
    const products = {
        filters: [],
        items: null
    };

    const { root } = createTestInstance(
        <Suggestions products={products} visible={true} />
    );

    expect(root.children).toEqual([]);
});

test('renders null if there are no filters', () => {
    const products = {
        filters: null,
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions products={products} visible={true} />
    );

    expect(root.children).toEqual([]);
});

test('renders null if visible is false', () => {
    const products = {
        filters: [],
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions products={products} visible={false} />
    );

    expect(root.children).toEqual([]);
});

test('renders a category list', () => {
    const products = {
        filters,
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions products={products} visible={true} />
    );

    expect(
        root.findByProps({ categories: filters[1].filter_items })
    ).toBeTruthy();
});
