import { useCallback, useRef, useState, useMemo } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useCartContext } from '../../context/cart';
import { useUserContext } from '../../context/user';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';
import { retrieveCartId } from '../../store/actions/cart';

import DEFAULT_OPERATIONS from './signIn.gql';

export const useSignIn = props => {
    const {
        getCartDetailsQuery,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCustomerQuery,
        mergeCartsMutation,
        signInMutation
    } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear all cart/customer data from cache and redux.
                await apolloClient.clearCacheData(apolloClient, 'cart');
                await apolloClient.clearCacheData(apolloClient, 'checkout');
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            cartId,
            apolloClient,
            removeCart,
            signIn,
            setToken,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails
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

    const errors = useMemo(
        () =>
            new Map([
                ['getUserDetailsQuery', getDetailsError],
                ['signInMutation', signInError]
            ]),
        [getDetailsError, signInError]
    );

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
