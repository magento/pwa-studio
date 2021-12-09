import React from 'react';
import { act } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import createTestInstance from '../../../util/createTestInstance';

import { useCategoryTree } from '../useCategoryTree';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);
    const useQuery = jest.fn().mockReturnValue({
        data: {
            storeConfig: {
                store_code: 'default',
                category_url_suffix: '.html'
            }
        }
    });

    return { ...apolloClient, useLazyQuery, useQuery };
});

const result = {
    data: {
        categories: {
            items: [
                {
                    uid: 'UID1==',
                    name: 'One',
                    url_path: '1',
                    include_in_menu: 1,
                    children_count: 3,
                    children: [
                        {
                            uid: 'UID2==',
                            include_in_menu: 1,
                            children_count: 1,
                            name: 'Two',
                            position: 0,
                            url_path: '1/2'
                        },
                        {
                            uid: 'UID3==',
                            include_in_menu: 1,
                            children_count: 0,
                            name: 'Three',
                            position: 0,
                            url_path: '1/2/3'
                        },
                        {
                            uid: 'UID4==',
                            include_in_menu: 1,
                            children_count: 0,
                            name: 'Four',
                            position: 0,
                            url_path: '1/4'
                        }
                    ]
                }
            ]
        }
    }
};

const getNavigationMenuQuery = 'getNavigationMenuQuery';
const getNavigationMenu = jest.fn();
const getNavigationMenuQueryResult = jest
    .fn()
    .mockReturnValue([getNavigationMenu, result]);

const props = {
    categoryId: 2,
    query: getNavigationMenuQuery,
    updateCategories: jest.fn()
};

const log = jest.fn();

/**
 * Helpers
 */

const Component = props => {
    const talonProps = useCategoryTree(props);
    log(talonProps);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

/**
 * Tests
 */

test('returns the correct shape', () => {
    useLazyQuery.mockImplementation(() => {
        return getNavigationMenuQueryResult();
    });

    const { talonProps } = getTalonProps(props);

    expect(talonProps).toMatchSnapshot();
});

test('runs the lazy query on mount', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);
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
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useLazyQuery.mockReturnValue([runQuery, queryResult]);
    const instance = createTestInstance(<Component {...props} />);

    act(() => {
        instance.update(<Component {...props} categoryId={3} />);
    });

    expect(runQuery).toHaveBeenCalledTimes(2);
    expect(runQuery).toHaveBeenNthCalledWith(2, {
        variables: {
            id: 3
        }
    });
});

test('avoids running the query without a category id', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);
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

describe('child categories', () => {
    test('is empty when categoryId is not in the category list', () => {
        // Arrange: purposefully set a categoryId that isn't in the category list.
        const myProps = {
            ...props,
            categoryId: 404
        };

        // Act.
        createTestInstance(<Component {...myProps} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.size).toEqual(0);
    });

    test('includes the root category when appropriate', () => {
        // Arrange.
        useLazyQuery.mockImplementation(() => {
            return getNavigationMenuQueryResult();
        });
        // There's nothing to arrange here, the default values for props
        // and categories are already arranged for this test to succeed.

        // Act.
        createTestInstance(<Component {...props} />);
        //
        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has('UID1==')).toEqual(true);
    });

    test('does not include root category when include_in_menu is falsy', () => {
        // Arrange.
        useLazyQuery.mockImplementation(() => {
            return jest.fn().mockReturnValue([
                getNavigationMenu,
                {
                    data: {
                        categories: {
                            items: [
                                {
                                    ...result.data.categories.items[0],
                                    include_in_menu: 0
                                }
                            ]
                        }
                    }
                }
            ])();
        });

        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has(1)).toEqual(false);
    });

    test('does not include root category when url_path is falsy', () => {
        // Arrange.
        useLazyQuery.mockImplementation(() => {
            return jest.fn().mockReturnValue([
                getNavigationMenu,
                {
                    data: {
                        categories: {
                            items: [
                                {
                                    ...result.data.categories.items[0],
                                    url_path: ''
                                }
                            ]
                        }
                    }
                }
            ])();
        });

        // Act.
        createTestInstance(<Component {...props} />);

        // Assert.
        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.has(1)).toEqual(false);
    });

    test('Does not include child category when include_in_menu is falsy', () => {
        const categoryId = 5;
        useLazyQuery.mockImplementation(() => {
            return jest.fn().mockReturnValue([
                getNavigationMenu,
                {
                    data: {
                        categories: {
                            items: [
                                {
                                    ...result.data.categories.items[0],
                                    children: [
                                        ...result.data.categories.items[0]
                                            .children,
                                        {
                                            id: categoryId,
                                            include_in_menu: 0,
                                            children_count: 0,
                                            name: 'Five',
                                            position: 0,
                                            url_path: '1/5'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            ])();
        });

        createTestInstance(<Component {...props} />);

        const { childCategories } = log.mock.calls[0][0];
        expect(childCategories.get(categoryId)).toBeUndefined();
    });
});
