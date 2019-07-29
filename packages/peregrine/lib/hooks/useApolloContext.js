import { useContext } from 'react';
import { ApolloContext } from 'react-apollo';

/**
 * A function that provides access to the [Apollo client]{@link https://www.apollographql.com/docs/react/api/apollo-client} API.
 *
 * Beyond the client, ApolloContext includes additional private values.
 * This hook only provides the client, as downstream consumers should
 * only need the client in order to perform queries.
 *
 * If a consumer needs those private context values, it should consume
 * ApolloContext directly, instead of using this hook.
 *
 * @return {ApolloClient} The Apollo client for this application
 * @kind function
 */
export const useApolloContext = () => {
    const { client } = useContext(ApolloContext) || {};

    return client;
};
