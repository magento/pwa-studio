import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

/**
 * useSkippableQuery can be used in place of useQuery(..., { skip: true }) as
 * there is a bug in Apollo v3 with the skip flag in useQuery.
 * https://github.com/apollographql/apollo-client/issues/6670
 * @param {DocumentNode} query
 * @param {LazyQueryHookOptions} options
 */
const useSkippableQuery = (query, options) => {
    const { skip, ...rest } = options;

    const [lazyQuery, result] = useLazyQuery(query, rest);

    useEffect(() => {
        if (!skip) lazyQuery();
    }, [lazyQuery, skip]);

    /* On the first render cycle, lazy query always returns loading false because the useEffect has
     * not yet invoked the query. This ensures that the loading will be true on the first cycle
     * by checking the skip prop directly and checking the query has been called */
    const loading = result.loading || (!skip && !result.called);

    // If skip is true, unset data, as useQuery does.
    const data = !skip ? result.data : undefined;

    return { ...result, data, loading };
};

export default useSkippableQuery;
