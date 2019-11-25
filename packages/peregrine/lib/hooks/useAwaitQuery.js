import { useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

export const useAwaitQuery = query => {
    const apolloClient = useApolloClient();

    return useCallback(
        variables => {
            return apolloClient.query({
                query: query,
                variables: variables
            });
        },
        [apolloClient, query]
    );
};
