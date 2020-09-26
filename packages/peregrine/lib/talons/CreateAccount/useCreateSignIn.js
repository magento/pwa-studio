import { useMutation } from '@apollo/client';

/**
 * GraphQL mutations for the sign user after create
 * @property {GraphQLAST} signInMutation mutation for signing
 */
export const useCreateSignIn = props => {
    const { signInMutation } = props;
    return useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });
};
