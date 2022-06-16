import { useHistory } from 'react-router-dom';
import { useCallback, useRef, useState, useMemo } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';

import DEFAULT_OPERATIONS from './signIn.gql.js';
import registerUserAndSaveData from '@orienteed/lms/services/registerUserAndSaveData';

export const useSignIn = props => {
    const { getCartDetailsQuery, setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCustomerQuery,
        getMoodleTokenQuery,
        getMoodleIdQuery,
        setMoodleTokenAndIdMutation,
        mergeCartsMutation,
        signInMutation
    } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const history = useHistory();

    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const [{ isGettingDetails, getDetailsError }, { getUserDetails, setToken }] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const saveMoodleTokenAndId = (moodleToken, moodleId) => {
        localStorage.setItem('LMS_INTEGRATION_moodle_token', moodleToken);
        localStorage.setItem('LMS_INTEGRATION_moodle_id', moodleId);
    };

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const [setMoodleTokenAndId] = useMutation(setMoodleTokenAndIdMutation);
    const fetchMoodleToken = useAwaitQuery(getMoodleTokenQuery);
    const fetchMoodleId = useAwaitQuery(getMoodleIdQuery);
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

                // Moodle logic
                const moodleTokenResponse = await fetchMoodleToken();
                const moodleIdResponse = await fetchMoodleId();

                moodleTokenResponse.data.customer.moodle_token !== null &&
                moodleIdResponse.data.customer.moodle_id !== null
                    ? saveMoodleTokenAndId(
                          moodleTokenResponse.data.customer.moodle_token,
                          moodleIdResponse.data.customer.moodle_id
                      )
                    : registerUserAndSaveData(email, password, setMoodleTokenAndId, saveMoodleTokenAndId);

                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
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

                setIsSigningIn(false);
                history.push('/');
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
            fetchCartDetails,
            fetchMoodleToken,
            setMoodleTokenAndId,
            history
        ]
    );

    const handleCreateAccount = useCallback(() => {
        history.push('/create-account');
    }, [history]);

    const handleForgotPassword = useCallback(() => {
        history.push('/forgot-password');
    }, [history]);

    const errors = useMemo(() => new Map([['getUserDetailsQuery', getDetailsError], ['signInMutation', signInError]]), [
        getDetailsError,
        signInError
    ]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
