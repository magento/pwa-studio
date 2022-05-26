import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Suggestions from '../suggestions';

jest.mock('../suggestedCategories', () => () => null);
jest.mock('../suggestedProducts', () => () => null);

test('renders correctly', () => {
    const products = {
        items: [{}]
    };

    const filters = [];

    const instance = createTestInstance(
        <Suggestions
            displayResult={true}
            filters={filters}
            products={products}
            visible={true}
        />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders null if there are no items', () => {
    const products = {
        aggregations: [],
        items: null
    };

    const { root } = createTestInstance(
        <Suggestions displayResult={true} products={products} visible={true} />
    );

    expect(root.children).toEqual([]);
});

test('renders null if displayResult is false', () => {
    const products = {
        aggregations: [],
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions displayResult={false} products={products} visible={true} />
    );

    expect(root.children).toEqual([]);
});

test('renders null if visible is false', () => {
    const products = {
        items: []
    };
    const filters = [];

    const { root } = createTestInstance(
        <Suggestions
            displayResult={true}
            filters={filters}
            products={products}
            visible={false}
        />
    );

    expect(root.children).toEqual([]);
});

test('renders null if items array is empty', () => {
    const products = {
        items: []
    };
    const filters = [];

    const { root } = createTestInstance(
        <Suggestions
            displayResult={true}
            filters={filters}
            products={products}
            visible={true}
        />
    );

    expect(root.children).toEqual([]);
});

test('renders a category list', () => {
    const filters = [
        { label: 'Color', options: [] },
        { label: 'Category', options: [] }
    ];

    const products = {
        items: [{}]
    };

    const { root } = createTestInstance(
        <Suggestions
            displayResult={true}
            filters={filters}
            products={products}
            visible={true}
        />
    );

    expect(root.findByProps({ categories: filters[1].options })).toBeTruthy();
});
