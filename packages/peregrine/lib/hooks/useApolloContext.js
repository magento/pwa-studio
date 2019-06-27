import { useContext } from 'react';
import { ApolloContext } from 'react-apollo/ApolloContext';

/**
 * A function that provides access to the [Apollo client]{@link https://www.apollographql.com/docs/react/api/apollo-client} API.
 *
 * @return {ApolloClient} The Apollo client for this application
 * @kind function
 */
export const useApolloContext = () => useContext(ApolloContext);
