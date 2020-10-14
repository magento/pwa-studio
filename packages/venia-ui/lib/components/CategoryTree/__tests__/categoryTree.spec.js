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
        categoryId: props.categoryId,
        updateCategories: props.updateCategories
    });
});
