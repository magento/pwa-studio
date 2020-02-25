import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Suggestions from '../suggestions';

jest.mock('../suggestedCategories', () => () => null);
jest.mock('../suggestedProducts', () => () => null);

test('renders correctly', () => {
    const products = {
        aggregations: [],
        items: [{}]
    };

    const instance = createTestInstance(
        <Suggestions displayResult={true} products={products} visible={true} />
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

test('renders null if there are no filters', () => {
    const products = {
        aggregations: null,
        items: []
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
        aggregations: [],
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions displayResult={true} products={products} visible={false} />
    );

    expect(root.children).toEqual([]);
});

test('renders null if items array is empty', () => {
    const products = {
        aggregations: [],
        items: []
    };

    const { root } = createTestInstance(
        <Suggestions displayResult={true} products={products} visible={true} />
    );

    expect(root.children).toEqual([]);
});

test('renders a category list', () => {
    const aggregations = [
        { label: 'Color', options: [] },
        { label: 'Category', options: [] }
    ];

    const products = {
        aggregations,
        items: [{}]
    };

    const { root } = createTestInstance(
        <Suggestions displayResult={true} products={products} visible={true} />
    );

    expect(
        root.findByProps({ categories: aggregations[1].options })
    ).toBeTruthy();
});
