import { useContext } from 'react';
import { ApolloContext } from 'react-apollo/ApolloContext';

export const useApolloContext = () => useContext(ApolloContext);
