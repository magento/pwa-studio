import { useCallback, useRef, useState } from 'react';
import { useUserContext } from '../../context/user';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../context/cart';
import { useApolloClient } from '@apollo/react-hooks';

export const useSignIn = props => {
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        query
    } = props;

    const apolloClient = useApolloClient();

    const [isSigningIn, setIsSigningIn] = useState(false);

    const [, { removeCart }] = useCartContext();
    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(query);

    const errors = [];
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }
    if (getDetailsError) {
        errors.push(getDetailsError);
    }

    const formRef = useRef(null);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            try {
                // Sign in and save the token
                const response = await signIn({
                    variables: { email, password }
                });

                const token =
                    response && response.data.generateCustomerToken.token;

                setToken(token);

                // After login, once the token is saved to local storage, reset the store to set the bearer token.
                // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
                apolloClient.resetStore();

                // Then get user details
                await getUserDetails();

                // Then remove the old, guest cart and get the cart id from gql.
                // TODO: This logic may be replacable with mergeCart in 2.3.4
                await removeCart();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [apolloClient, getUserDetails, removeCart, setToken, signIn]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    return {
        errors,
        formRef,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn
    };
};
