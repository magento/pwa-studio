import { useContext } from 'react';
import { ApolloContext } from 'react-apollo';

/**
 * A function that provides access to the [Apollo client]{@link https://www.apollographql.com/docs/react/api/apollo-client} API.
 *
 * @return {ApolloClient} The Apollo client for this application
 * @kind function
 */
export const useApolloContext = () => {
    const { client } = useContext(ApolloContext) || {};

    return client;
};
