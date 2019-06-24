import { useCallback, useMemo } from 'react';

import { useApolloContext } from './useApolloContext';
import { useQueryResult } from './useQueryResult';

export const useQuery = query => {
    const apolloClient = useApolloContext();
    const [queryResultState, queryResultApi] = useQueryResult();
    const { receiveResponse } = queryResultApi;

    // define a callback that performs a query
    // either as an effect or in response to user interaction
    const runQuery = useCallback(
        async ({ variables }) => {
            const payload = await apolloClient.query({ query, variables });
            receiveResponse(payload);
        },
        [apolloClient, query, receiveResponse]
    );

    // this object should never change
    const api = useMemo(
        () => ({
            ...queryResultApi,
            runQuery
        }),
        [queryResultApi, runQuery]
    );

    return [queryResultState, api];
};
