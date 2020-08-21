import React from 'react';
import { act } from 'react-test-renderer';
import { runQuery, queryResult, useLazyQuery } from '@apollo/react-hooks';
import createTestInstance from '../../../util/createTestInstance';

import { useCategoryTree } from '../useCategoryTree';

jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { runQuery, queryResult, useLazyQuery };
});

const props = {
    categories: {},
    categoryId: 1,
    query: {},
    updateCategories: jest.fn()
};

const categories = {
    1: {
        children: [2, 4],
        children_count: 2,
        id: 1,
        include_in_menu: 1,
        name: 'One',
        url_path: '1'
    },
    2: {
        id: 2,
        include_in_menu: 1,
        name: 'Two',
        parentId: 1,
        url_path: '1/2',
        productImagePreview: {
            items: [{ small_image: 'media/img-2.jpg' }]
        }
    },
    3: {
        id: 3,
        include_in_menu: 1,
        name: 'Three',
        parentId: 2,
        url_path: '1/2/3',
        productImagePreview: {
            items: [{ small_image: 'media/img-3.jpg' }]
        }
    },
    4: {
        id: 4,
        include_in_menu: 1,
        name: 'Four',
        parentId: 1,
        url_path: '1/4',
        productImagePreview: {
            items: [{ small_image: 'media/img-4.jpg' }]
        }
    }
};

const log = jest.fn();

const Component = props => {
    const talonProps = useCategoryTree(props);
    log(talonProps);

    return <i />;
};

test('runs the lazy query on mount', () => {
    createTestInstance(<Component {...props} />);

    act(() => {});

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenNthCalledWith(1, {
        variables: {
            id: props.categoryId
        }
    });
});

test('runs the lazy query when categoryId changes', () => {
    const instance = createTestInstance(<Component {...props} />);

    act(() => {
        instance.update(<Component {...props} categoryId={2} />);
    });

    expect(runQuery).toHaveBeenCalledTimes(2);
    expect(runQuery).toHaveBeenNthCalledWith(2, {
        variables: {
            id: 2
        }
    });
});

test('avoids running the query without a category id', () => {
    createTestInstance(<Component {...props} categoryId={null} />);

    act(() => {});

    expect(runQuery).not.toHaveBeenCalled();
});

test('avoids calling updateCategories without data', () => {
    const { updateCategories } = props;
    createTestInstance(<Component {...props} />);

    act(() => {});

    expect(updateCategories).not.toHaveBeenCalled();
});

test('calls updateCategories when data changes', () => {
    const { updateCategories } = props;
    const category = categories[1];
    const data = {
        category: {
            ...category,
            children: Array.from(category.children, id => categories[id])
        }
    };

    const nextqueryResult = { ...queryResult, data };

    useLazyQuery.mockImplementationOnce(() => [runQuery, nextqueryResult]);

    createTestInstance(<Component {...props} />);

    act(() => {});

    expect(updateCategories).toHaveBeenCalledTimes(1);
    expect(updateCategories).toHaveBeenNthCalledWith(1, data.category);
});

describe('child categories', () => {
    test('is a Map', () => {
        createTestInstance(<Component {...props} categories={categories} />);

        expect(log).toHaveBeenNthCalledWith(1, {
            childCategories: expect.any(Map)
        });
    });

    test('is empty when categoryId is not in the category list', () => {
        // Arrange: purposefully set a categoryId that isn't in the category list.
        const myProps = {
            ...props,
            categoryId: 404
        };

        // Act.
        createTestInstance(<Component {...myProps} categories={categories} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.size).toEqual(0);
    });

    test('includes the root category when appropriate', () => {
        // Arrange.
        // There's nothing to arrange here, the default values for props
        // and categories are already arranged for this test to succeed.

        // Act.
        createTestInstance(<Component {...props} categories={categories} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has(1)).toEqual(true);
    });

    test('does not include root category when include_in_menu is falsy', () => {
        // Arrange.
        const myCategories = {
            ...categories,
            1: {
                ...categories['1'],
                include_in_menu: 0
            }
        };

        // Act.
        createTestInstance(<Component {...props} categories={myCategories} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has(1)).toEqual(false);
    });

    test('does not include root category when url_path is falsy', () => {
        // Arrange.
        const myCategories = {
            ...categories,
            1: {
                ...categories['1'],
                url_path: ''
            }
        };

        // Act.
        createTestInstance(<Component {...props} categories={myCategories} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has(1)).toEqual(false);
    });
});
