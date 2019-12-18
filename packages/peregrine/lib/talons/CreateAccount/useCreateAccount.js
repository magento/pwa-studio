import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

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
        createAccountQuery,
        createCartMutation,
        customerQuery,
        initialValues = {},
        onSubmit,
        signInMutation
    } = props;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, removeCart }] = useCartContext();
    const [
        { isGettingDetails, isSignedIn },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [createAccount, { error: createAccountError }] = useMutation(
        createAccountQuery
    );

    const [fetchCartId] = useMutation(createCartMutation);
    const [signIn, { error: signInError }] = useMutation(signInMutation);
    const fetchUserDetails = useAwaitQuery(customerQuery);

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
                        password: formValues.password
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

                // Immediately remove/create the cart.
                // TODO: This logic may be replacable with mergeCart in 2.3.4
                await removeCart();
                createCart({
                    fetchCartId
                });

                await getUserDetails({ fetchUserDetails });

                // Finally, invoke the post-submission callback.
                onSubmit();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [
            createAccount,
            createCart,
            fetchCartId,
            fetchUserDetails,
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
