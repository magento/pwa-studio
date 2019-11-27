import { useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

/**
 * A hook that will return a invokable query that returns a Promise. Intended
 * to be used in Redux thunks that shouldn't have knowledge of queries being ran
 * but needed the ability to fetch data asyncronously inside of their actions.
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
