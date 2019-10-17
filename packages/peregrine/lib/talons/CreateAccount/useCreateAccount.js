import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {String} query the graphql query for creating the account
 * @returns {{
 *   errors: array,
 *   handleSubmit: function,
 *   isDisabled: boolean,
 *   isSignedIn: boolean,
 *   initialValues: object
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit, query } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [{ isSignedIn }, { signIn }] = useUserContext();
    const [createAccount, { error }] = useMutation(query);

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

                // Then sign the user in.
                await signIn({
                    username: formValues.customer.email,
                    password: formValues.password
                });

                // Finally, invoke the post-submission callback.
                onSubmit();
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [createAccount, onSubmit, signIn]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    return {
        errors: (error && error.graphQLErrors) || [],
        handleSubmit,
        isDisabled: isSubmitting,
        isSignedIn,
        initialValues: sanitizedInitialValues
    };
};
