import { useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

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
