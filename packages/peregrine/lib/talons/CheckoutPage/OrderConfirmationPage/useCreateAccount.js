import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useUserContext } from '../../../context/user';
import { useCartContext } from '../../../context/cart';
import { useAwaitQuery } from '../../../hooks/useAwaitQuery';
import { useGoogleReCaptcha } from '../../../hooks/useGoogleReCaptcha';

import DEFAULT_OPERATIONS from './createAccount.gql';
import { useEventingContext } from '../../../context/eventing';
import { useHistory } from 'react-router-dom';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * This talon is almost identical to the other useCreateAccount but does not
 * return `isSignedIn`.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Object} props.operations GraphQL operations use by talon
 * @returns {{
 *   errors: Map,
 *   handleSubmit: function,
 *   handleEnterKeyPress: function,
 *   isDisabled: boolean,
 *   initialValues: object,
 *   recaptchaWidgetProps: { containerElement: function, shouldRender: boolean }
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createAccountMutation,
        createCartMutation,
        getCartDetailsQuery,
        getCustomerQuery,
        signInMutation,
        getStoreConfigQuery
    } = operations;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [
        { isGettingDetails },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [, { dispatch }] = useEventingContext();

    const [fetchCartId] = useMutation(createCartMutation);

    // For create account and sign in mutations, we don't want to cache any
    // personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [createAccount, { error: createAccountError }] = useMutation(
        createAccountMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const {
        minimumPasswordLength,
        customerAccessTokenLifetime
    } = useMemo(() => {
        const storeConfig = storeConfigData?.storeConfig || {};

        return {
            minimumPasswordLength: storeConfig.minimum_password_length,
            customerAccessTokenLifetime:
                storeConfig.customer_access_token_lifetime
        };
    }, [storeConfigData]);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const {
        generateReCaptchaData,
        recaptchaLoading,
        recaptchaWidgetProps
    } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_CREATE',
        formAction: 'createAccount'
    });

    const history = useHistory();
    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                // Get reCaptchaV3 Data for createAccount mutation
                const recaptchaDataForCreateAccount = await generateReCaptchaData();

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    },
                    ...recaptchaDataForCreateAccount
                });

                dispatch({
                    type: 'USER_CREATE_ACCOUNT',
                    payload: {
                        email: formValues.customer.email,
                        firstName: formValues.customer.firstname,
                        lastName: formValues.customer.lastname,
                        isSubscribed: !!formValues.subscribe
                    }
                });

                // Get reCaptchaV3 Data for signIn mutation
                const recaptchaDataForSignIn = await generateReCaptchaData();

                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    },
                    ...recaptchaDataForSignIn
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await (customerAccessTokenLifetime
                    ? setToken(token, customerAccessTokenLifetime)
                    : setToken(token));

                // Clear guest cart from redux.
                await removeCart();

                // Create a new customer cart.
                await createCart({
                    fetchCartId
                });

                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }

                history.push('/account-information');
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            customerAccessTokenLifetime,
            createAccount,
            createCart,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            generateReCaptchaData,
            getCartDetails,
            getUserDetails,
            onSubmit,
            removeCart,
            setToken,
            signIn,
            dispatch,
            history
        ]
    );

    const handleEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        };
    }, [handleSubmit]);

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () =>
            new Map([
                ['createAccountQuery', createAccountError],
                ['signInMutation', signInError]
            ]),
        [createAccountError, signInError]
    );

    return {
        errors,
        handleSubmit,
        handleEnterKeyPress,
        isDisabled: isSubmitting || isGettingDetails || recaptchaLoading,
        initialValues: sanitizedInitialValues,
        recaptchaWidgetProps,
        minimumPasswordLength
    };
};
