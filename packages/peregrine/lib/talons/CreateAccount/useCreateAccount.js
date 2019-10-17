import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @returns {{
 *   errors: array - contains array of error types like `CREATE_ACCOUNT_ERROR` or `EMAIL_UNAVAILABLE`,
 *   handleSubmit: function,
 *   isDisabled: boolean,
 *   isSignedIn: boolean,
 *   initialValues: object
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit, query } = props;
    const [formValues, setFormValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [
        { createAccountError, isCreatingAccount, isSignedIn },
        { createAccount }
    ] = useUserContext();

    const [runQuery, queryResponse] = useLazyQuery(query);
    const { called, loading, error, data } = queryResponse;

    // When the user clicks "Submit", store the form values for later use and
    // start the pre-submission validation query.
    const handleSubmit = useCallback(
        values => {
            setIsSubmitting(true);
            setFormValues(values);
            runQuery({
                variables: {
                    email: values.customer.email
                }
            });
        },
        [runQuery]
    );

    const shouldSubmit =
        called &&
        !loading &&
        !error &&
        data &&
        data.isEmailAvailable.is_email_available;

    // When the form validation succeeds we then should invoke the
    // `createAccount` action and afterwards the onSubmit handler.
    useEffect(() => {
        const submit = async () => {
            await createAccount(formValues);
            setIsSubmitting(false);
            onSubmit(formValues);
        };

        if (shouldSubmit) {
            submit();
        }
    }, [createAccount, formValues, onSubmit, shouldSubmit]);

    // If we received any errors from the pre-submission query, allow re-submit
    // so people can fix the issue and try again.
    useEffect(() => {
        if (isSubmitting && data && !data.isEmailAvailable.is_email_available) {
            setIsSubmitting(false);
        }
    }, [data, isSubmitting]);

    // Mapping of message to type is done in the UI component.
    const errors = new Set();
    if (createAccountError) {
        errors.add('CREATE_ACCOUNT_ERROR');
    }

    if (data && !data.isEmailAvailable.is_email_available) {
        errors.add('EMAIL_UNAVAILABLE');
    }

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
        isDisabled: isCreatingAccount || isSubmitting,
        isSignedIn,
        initialValues: sanitizedInitialValues
    };
};
