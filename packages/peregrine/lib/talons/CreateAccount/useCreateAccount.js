import { useCallback, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render CreateAccount component.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @returns {{
 *   isDisabled: boolean,
 *   isSignedIn: boolean,
 *   initialValues: object
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit, query } = props;

    const [
        { createAccountError, isCreatingAccount, isSignedIn }
    ] = useUserContext();

    const [runQuery, queryResponse] = useLazyQuery(query);
    const { called, loading, error, data } = queryResponse;

    const handleSubmit = useCallback(
        values => {
            runQuery({
                variables: {
                    email: values.customer.email
                }
            });
        },
        [runQuery]
    );

    useEffect(() => {
        if (called && !loading && !error && data) {
            if (data.isEmailAvailable.is_email_available) {
                onSubmit();
            }
        }
    }, [onSubmit, called, loading, error, data]);

    // Mapping of message to type is done in the UI component.
    const errors = [];
    if (createAccountError) {
        errors.push({
            type: 'CREATE_ACCOUNT_ERROR'
        });
    }

    if (data && !data.isEmailAvailable.is_email_available) {
        errors.push({
            type: 'EMAIL_UNAVAILABLE'
        });
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
        isDisabled: isCreatingAccount,
        isSignedIn,
        initialValues: sanitizedInitialValues
    };
};
