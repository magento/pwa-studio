import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

import { useUserContext } from '../../../../lib/context/user';
import { useCartContext } from '../../../../lib/context/cart';
import { useAwaitQuery } from '../../../../lib/hooks/useAwaitQuery';

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
 * @param {String} createAccountQuery the graphql query for creating the account
 * @param {String} signInQuery the graphql query for logging in the user (and obtaining the token)
 * @returns {{
 *   errors: Map,
 *   handleSubmit: function,
 *   isDisabled: boolean,
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [
        { isGettingDetails },
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

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
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
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
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
        isDisabled: isSubmitting || isGettingDetails,
        initialValues: sanitizedInitialValues
    };
};
