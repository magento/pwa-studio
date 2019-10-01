import { useEffect } from 'react';
import { useQuery } from '../../hooks/useQuery';

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
    const [queryResult, queryApi] = useQuery(query);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    useEffect(() => {
        setLoading(true);

        runQuery({
            variables: {
                id
            }
        });
    }, [runQuery, setLoading, id]);

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        error,
        loading
    };
};
