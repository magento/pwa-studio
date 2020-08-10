import { useCallback, useMemo, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { useUserContext } from '../../../lib/context/user';
import { useCartContext } from '../../../lib/context/cart';
import { useAwaitQuery } from '../../../lib/hooks/useAwaitQuery';
import { clearCartDataFromCache } from '../../Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '../../Apollo/clearCustomerDataFromCache';
import { retrieveCartId } from '../../store/actions/cart';

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
        mutations: { createCartMutation, signInMutation, mergeCartsMutation },
        initialValues = {},
        onSubmit
    } = props;
    const apolloClient = useApolloClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();
    const [
        { isGettingDetails, isSignedIn },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [fetchCartId] = useMutation(createCartMutation);

    const [mergeCarts] = useMutation(mergeCartsMutation);

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
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    }
                });
                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

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
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            cartId,
            apolloClient,
            removeCart,
            createAccount,
            signIn,
            setToken,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            onSubmit
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
