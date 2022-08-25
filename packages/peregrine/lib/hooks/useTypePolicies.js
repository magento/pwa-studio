import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';

/**
 * @typedef {string} Type
 * @description A data type as described by your GraphQL schema.
 */

/**
 * @typedef {Object} TypePolicy
 * @description A policy object for a given type.
 * See https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 */

/**
 * @typedef {Object<Type,TypePolicy>} TypePolicyMap
 * @description A map of Types to type policy object.
 */

/**
 * Adds given type policies to the Apollo Client.
 *
 * @param {TypePolicyMap} typePolicies
 */
export const useTypePolicies = typePolicies => {
    const apolloClient = useApolloClient();

    useEffect(() => {
        apolloClient.cache.policies.addTypePolicies(typePolicies);
    }, [apolloClient, typePolicies]);
};
