import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCategoryTree } from '@magento/peregrine/lib/talons/CategoryTree';

import CategoryTree from '../categoryTree';

jest.mock('../../../classify');
jest.mock('../categoryBranch', () => () => <i />);
jest.mock('../categoryLeaf', () => () => <i />);

jest.mock('@magento/peregrine/lib/talons/CategoryTree', () => {
    const childCategories = new Map();
    const useCategoryTree = jest.fn(() => ({ childCategories }));

    return { useCategoryTree };
});

const props = {
    categories: {},
    categoryId: 1,
    onNavigate: jest.fn(),
    setCategoryId: jest.fn(),
    updateCategories: jest.fn()
};

test('renders correctly without data', async () => {
    const instance = createTestInstance(<CategoryTree {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('calls talon with correct props', async () => {
    createTestInstance(<CategoryTree {...props} />);

    expect(useCategoryTree).toHaveBeenCalledTimes(1);
    expect(useCategoryTree).toHaveBeenNthCalledWith(1, {
        categories: props.categories,
        categoryId: props.categoryId,
        query: expect.any(Object),
        updateCategories: props.updateCategories
    });
});

test('calls childCategories from talon props', async () => {
    useCategoryTree.mockReturnValue({
        childCategories: new Map([
            ['1', { category: 'Shirts', isLeaf: false, parentCategory: null }],
            ['2', { category: 'Short Sleeve', isLeaf: true, parentCategory: 1 }]
        ])
    });

    const instance = createTestInstance(<CategoryTree {...props} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
