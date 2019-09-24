import { useEffect } from 'react';
import { useQuery } from '../../hooks/useQuery';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ data: object, error: boolean, loading: boolean }}
 */
export const useCategoryList = props => {
    const { query, id } = props;
    const [queryResult, queryApi] = useQuery(query);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);

            await runQuery({
                variables: {
                    id
                }
            });

            setLoading(false);
        };

        fetchCategories();
    }, [runQuery, setLoading, id]);

    return {
        data,
        error,
        loading
    };
};
