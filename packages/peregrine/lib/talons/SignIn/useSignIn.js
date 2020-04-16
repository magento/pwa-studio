import { useCallback, useRef, useState } from 'react';
import { useUserContext } from '../../context/user';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../context/cart';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';
import { deleteCacheEntry } from '../../Apollo/deleteCacheEntry';

export const useSignIn = props => {
    const {
        createCartMutation,
        customerQuery,
        getCartDetailsQuery,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signInMutation
    } = props;
    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });
    const [fetchCartId] = useMutation(createCartMutation);
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const errors = [];
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }
    if (getDetailsError) {
        errors.push(getDetailsError);
    }

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

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

                await setToken(token);
                await getUserDetails({ fetchUserDetails });

                // Then remove the old guest cart and get the cart id from gql.
                // TODO: This logic may be replacable with mergeCart in 2.3.4
                await removeCart();

                // Delete stale cart data from apollo
                await deleteCacheEntry(apolloClient, key => key.match(/^Cart/));

                await createCart({
                    fetchCartId
                });

                await getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            apolloClient,
            createCart,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            getCartDetails,
            getUserDetails,
            removeCart,
            setToken,
            signIn
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
