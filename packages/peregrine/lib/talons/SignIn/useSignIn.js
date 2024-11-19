import { useCallback, useRef, useState, useMemo } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';

import { useGoogleReCaptcha } from '../../hooks/useGoogleReCaptcha/useGoogleReCaptcha';
import mergeOperations from '../../util/shallowMerge';
import { useCartContext } from '../../context/cart';
import { useUserContext } from '../../context/user';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';
import { retrieveCartId } from '../../store/actions/cart';

import DEFAULT_OPERATIONS from './signIn.gql';
import { useEventingContext } from '../../context/eventing';
import { useHistory, useLocation } from 'react-router-dom';

/**
 * Routes to redirect from if used to create an account.
 */
const REDIRECT_FOR_ROUTES = ['/checkout', '/order-confirmation'];

export const useSignIn = props => {
    const {
        handleTriggerClick,
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
        signInMutation,
        getStoreConfigQuery
    } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const cartContext = useCartContext();
    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = cartContext;

    const userContext = useUserContext();
    const [
        { isGettingDetails, getDetailsError, userOnOrderSuccess },
        { getUserDetails, setToken }
    ] = userContext;

    const eventingContext = useEventingContext();
    const [, { dispatch }] = eventingContext;

    const signInMutationResult = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });
    const [signIn, { error: signInError }] = signInMutationResult;

    const googleReCaptcha = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_LOGIN',
        formAction: 'signIn'
    });
    const {
        generateReCaptchaData,
        recaptchaLoading,
        recaptchaWidgetProps
    } = googleReCaptcha;

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { customerAccessTokenLifetime } = useMemo(() => {
        const storeConfig = storeConfigData?.storeConfig || {};

        return {
            customerAccessTokenLifetime:
                storeConfig.customer_access_token_lifetime
        };
    }, [storeConfigData]);
    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const history = useHistory();
    const location = useLocation();

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            handleTriggerClick();

            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Get recaptchaV3 data for login
                const recaptchaData = await generateReCaptchaData();

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: {
                        email,
                        password
                    },
                    ...recaptchaData
                });

                const token = signInResponse.data.generateCustomerToken.token;
                await (customerAccessTokenLifetime
                    ? setToken(token, customerAccessTokenLifetime)
                    : setToken(token));

                // Clear all cart/customer data from cache and redux.
                await apolloClient.clearCacheData(apolloClient, 'cart');
                await apolloClient.clearCacheData(apolloClient, 'customer');
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

                await getUserDetails({ fetchUserDetails });

                const { data } = await fetchUserDetails({
                    fetchPolicy: 'cache-only'
                });

                dispatch({
                    type: 'USER_SIGN_IN',
                    payload: {
                        ...data.customer
                    }
                });

                getCartDetails({ fetchCartId, fetchCartDetails });

                if (
                    userOnOrderSuccess &&
                    REDIRECT_FOR_ROUTES.includes(location.pathname)
                ) {
                    history.push('/order-history');
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            customerAccessTokenLifetime,
            cartId,
            generateReCaptchaData,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            dispatch,
            handleTriggerClick,
            history,
            location.pathname,
            userOnOrderSuccess
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const forgotPasswordHandleEnterKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
                handleForgotPassword();
            }
        },
        [handleForgotPassword]
    );

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    const handleEnterKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
                handleCreateAccount();
            }
        },
        [handleCreateAccount]
    );

    const signinHandleEnterKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        },
        [handleSubmit]
    );

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
        handleEnterKeyPress,
        signinHandleEnterKeyPress,
        handleForgotPassword,
        forgotPasswordHandleEnterKeyPress,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn || recaptchaLoading,
        setFormApi,
        recaptchaWidgetProps,
        userContext,
        cartContext,
        eventingContext,
        signInMutationResult,
        googleReCaptcha,
        isSigningIn,
        setIsSigningIn,
        fetchCartId,
        mergeCarts,
        fetchUserDetails,
        fetchCartDetails
    };
};
