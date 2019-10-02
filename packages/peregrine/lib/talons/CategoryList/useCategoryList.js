import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

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

    const [runQuery, queryResult] = useLazyQuery(query);
    const { loading, error, data } = queryResult;

    useEffect(() => {
        runQuery({
            variables: {
                id
            }
        });
    }, [runQuery, id]);

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        error,
        loading
    };
};
