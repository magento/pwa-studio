import { useEffect, useMemo } from 'react';
import { useQuery } from '../../hooks/useQuery';

export const useCategoryTree = props => {
    const { categories, categoryId, query, updateCategories } = props;

    const [queryResult, queryApi] = useQuery(query);
    const { data } = queryResult;
    const { runQuery } = queryApi;

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

        for (const id of children || '') {
            const category = categories[id];
            const isLeaf = category.children_count === '0';

            childCategories.set(id, { category, isLeaf });
        }

        return childCategories;
    }, [categories, children]);

    return { childCategories };
};
