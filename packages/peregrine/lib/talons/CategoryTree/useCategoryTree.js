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
 * @param {number} props.categoryId - category id for this node
 * @param {DocumentNode} props.query - GraphQL query
 * @param {function} props.updateCategories - bound action creator
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
export const useCategoryTree = props => {
    const { categoryId, query, updateCategories } = props;
    const [runQuery, queryResult] = useLazyQuery(query, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
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
    const rootCategory = data && data.category;
    const { children = [] } = rootCategory || {};
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
        children.map(category => {
            const isLeaf = !parseInt(category.children_count);
            childCategories.set(`${category.id}-${category.name}`, {
                category,
                isLeaf
            });
        });
        return childCategories;
    }, [children, rootCategory]);
    return { childCategories, data };
};
