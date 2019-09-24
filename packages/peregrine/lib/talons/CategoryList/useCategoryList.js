import { useEffect } from 'react';
import { useQuery } from '../../hooks/useQuery';

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
