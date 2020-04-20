import { useCallback, useMemo, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { deleteCacheEntry } from '../../Apollo/deleteCacheEntry';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {String} createAccountQuery the graphql query for creating the account
 * @param {String} signInQuery the graphql query for logging in the user (and obtaining the token)
 * @returns {{
 *   errors: array,
 *   handleSubmit: function,
 *   isDisabled: boolean,
 *   isSignedIn: boolean,
 *   initialValues: object
 * }}
 */
export const useCreateAccount = props => {
    const {
        queries: { createAccountQuery, customerQuery, getCartDetailsQuery },
        mutations: { createCartMutation, signInMutation },
        initialValues = {},
        onSubmit
    } = props;
    const apolloClient = useApolloClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [
        { isGettingDetails, isSignedIn },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [fetchCartId] = useMutation(createCartMutation);

    // For create account and sign in mutations, we don't want to cache any
    // personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [createAccount, { error: createAccountError }] = useMutation(
        createAccountQuery,
        {
            fetchPolicy: 'no-cache'
        }
    );
    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const fetchUserDetails = useAwaitQuery(customerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const errors = [];
    if (createAccountError) {
        errors.push(createAccountError.graphQLErrors[0]);
    }
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                // Try to create an account with the mutation.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    }
                });

                // Sign in and save the token
                const response = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    }
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

                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            apolloClient,
            createAccount,
            createCart,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            getCartDetails,
            getUserDetails,
            onSubmit,
            removeCart,
            setToken,
            signIn
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    return {
        errors,
        handleSubmit,
        isDisabled: isSubmitting || isGettingDetails,
        isSignedIn,
        initialValues: sanitizedInitialValues
    };
};
