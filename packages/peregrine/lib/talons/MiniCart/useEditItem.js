import { useEffect } from 'react';
import { useQuery } from '@magento/peregrine';

export const useEditItem = props => {
    const { item, query } = props;
    const [queryResult, queryApi] = useQuery(query);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    const itemHasOptions = item && item.options && item.options.length > 0;

    // Run the query once on mount and again whenever the
    // item being edited changes.
    useEffect(() => {
        const fetchItemVariants = async () => {
            setLoading(true);

            await runQuery({
                variables: {
                    name: item.name,
                    onServer: false
                }
            });

            setLoading(false);
        };

        // Only fetch item variants if it can have them.
        if (itemHasOptions) {
            fetchItemVariants();
        }
    }, [item, itemHasOptions, runQuery, setLoading]);

    // If we don't have possible options for the item just use an empty object
    const configItem = data && data.products && data.products.items[0];

    return {
        configItem,
        hasError: !!error,
        isLoading: !!loading,
        itemHasOptions
    };
};
