import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

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

    console.log('USE CATEGORY LIST');

    // Run the query immmediately.
    const { loading, error, data, refetch } = useQuery(query, {
        variables: {
            id
        }
    });

    // And every time id changes.
    useEffect(() => {
        refetch();
    }, [id, refetch]);

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        error,
        loading
    };
};
