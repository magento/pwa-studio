import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { Link } from 'src/drivers';
import SuggestedCategories from '../suggestedCategories';

jest.mock('src/drivers', () => ({
    Link: jest.fn(() => null)
}));

const categories = [
    { label: 'A', value_string: 'a' },
    { label: 'B', value_string: 'b' },
    { label: 'C', value_string: 'c' },
    { label: 'D', value_string: 'd' },
    { label: 'E', value_string: 'e' }
];

test('renders correctly', () => {
    const instance = createTestInstance(
        <SuggestedCategories categories={categories} value="foo" />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders a max of 4 categories by default', () => {
    const { root } = createTestInstance(
        <SuggestedCategories categories={categories} value="foo" />
    );

    expect(root.findAllByType(Link)).toHaveLength(4);
});

test('allows the render limit to be configured', () => {
    const { root } = createTestInstance(
        <SuggestedCategories categories={categories} limit={2} value="foo" />
    );

    expect(root.findAllByType(Link)).toHaveLength(2);
});
