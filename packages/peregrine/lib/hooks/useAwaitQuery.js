import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';

/**
 * A hook that will return a invokable query that returns a Promise. Intended
 * to be used in Redux thunks that shouldn't have knowledge of queries being ran
 * but needed the ability to fetch data asyncronously inside of their actions.
 *
 * NOTE: We have discovered a potential bug in Apollo that when passing the
 * fetchQuery option "network-only", results from the cache will still be
 * returned instead of the data from the network fetch. We suggest using
 * the "no-cache" option if you expect your queries to always return fresh
 * data, or data is sensitive that you do not want to persist in the app.
 *
 * @param {DocumentNode} query - parsed GraphQL operation description
 *
 * @returns {Function} callback that runs the query and returns a Promise
 */
export const useAwaitQuery = query => {
    const apolloClient = useApolloClient();

    return useCallback(
        options => {
            return apolloClient.query({
                ...options,
                query
            });
        },
        [apolloClient, query]
    );
};
