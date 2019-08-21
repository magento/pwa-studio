import { useCallback, useMemo } from 'react';

import { useApolloContext } from './useApolloContext';
import { useQueryResult } from './useQueryResult';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that provides
 * access to query results data and an API object for running the query and
 * managing a query result state object.
 *
 * @kind function
 *
 * @param {DocumentNode} query A GraphQL document containing a query to send to the server. See {@link https://github.com/apollographql/graphql-tag graphql-tag}
 *
 * @return {Object[]} An array with two entries containing the following content: [{@link ../useQueryResult#queryresultstate--object QueryResultState}, {@link API}]
 */
export const useQuery = query => {
    const apolloClient = useApolloContext();
    const [queryResultState, queryResultApi] = useQueryResult();
    const { receiveResponse } = queryResultApi;

    /**
     * A callback function that performs a query either as an effect or in response to user interaction.
     *
     * @function API.runQuery
     *
     * @param {DocumentNode} query A GraphQL document
     */
    const runQuery = useCallback(
        async ({ variables }) => {
            let payload;
            try {
                payload = await apolloClient.query({ query, variables });
            } catch (e) {
                payload = {
                    error: e
                };
            }
            receiveResponse(payload);
        },
        [apolloClient, query, receiveResponse]
    );

    /**
     * The API for managing the query.
     * Use this API to run queries and get the resulting state values and query data.
     *
     * In addition to the {@link API.runQuery runQuery()} function,
     * this object also contains the API methods from the {@link ../useQueryResult#api--object  useQueryResult hook}.
     *
     * @typedef API
     * @type Object
     */
    const api = useMemo(
        () => ({
            ...queryResultApi,
            runQuery
        }),
        [queryResultApi, runQuery]
    );

    return [queryResultState, api];
};
