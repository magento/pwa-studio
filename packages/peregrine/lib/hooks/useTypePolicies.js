import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';

/**
 * Adds given type policies to the Apollo Client.
 * @param {Object} typePolicies
 */
export const useTypePolicies = typePolicies => {
    const apolloClient = useApolloClient();

    useEffect(() => {
        apolloClient.cache.policies.addTypePolicies(typePolicies);
    }, [apolloClient, typePolicies]);
};
