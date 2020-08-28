import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

/**
 * @typedef {object} CategoryNode
 * @prop {object} category - category data
 * @prop {boolean} isLeaf - true if the category has no children
 */

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render a CategoryTree component.
 *
 * @param {object} props
 * @param {object} props.categories - all fetched categories
 * @param {number} props.categoryId - category id for this node
 * @param {DocumentNode} props.query - GraphQL query
 * @param {function} props.updateCategories - bound action creator
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
export const useCategoryTree = props => {
    const { categories, categoryId, query, updateCategories } = props;

    const [runQuery, queryResult] = useLazyQuery(query);
    const { data } = queryResult;

    // fetch categories
    useEffect(() => {
        if (categoryId != null) {
            runQuery({ variables: { id: categoryId } });
        }
    }, [categoryId, runQuery]);

    // update redux with fetched categories
    useEffect(() => {
        if (data && data.category) {
            updateCategories(data.category);
        }
    }, [data, updateCategories]);

    const rootCategory = categories[categoryId];
    const { children } = rootCategory || {};

    const childCategories = useMemo(() => {
        const childCategories = new Map();

        // Add the root category when appropriate.
        if (
            rootCategory &&
            rootCategory.include_in_menu &&
            rootCategory.url_path
        ) {
            childCategories.set(rootCategory.id, {
                category: rootCategory,
                isLeaf: true
            });
        }

        for (const id of children || '') {
            const category = categories[id];
            const isLeaf = !parseInt(category.children_count);

            childCategories.set(id, { category, isLeaf });
        }

        return childCategories;
    }, [categories, children, rootCategory]);

    return { childCategories, data };
};
