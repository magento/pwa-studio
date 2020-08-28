import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ childCategories: array, error: object }}
 */
export const useCategoryList = props => {
    const { query, id } = props;

    const [runQuery, queryResponse] = useLazyQuery(query);
    const { loading, error, data } = queryResponse;

    // Run the query immediately and every time id changes.
    useEffect(() => {
        runQuery({ variables: { id } });
    }, [id, runQuery]);

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        error,
        loading
    };
};
