import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

/**
 * Returns props necessary to render a ResetPassword form.
 *
 * @param {function} props.mutations - mutation to call when the user submits the new password.
 *
 * @returns {ResetPasswordProps} - GraphQL mutations for the reset password form.
 *
 * @example <caption>Importing into your project</caption>
 * import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword.js';
 */
export const useResetPassword = props => {
    const { mutations } = props;

    const [hasCompleted, setHasCompleted] = useState(false);
    const location = useLocation();
    const [
        resetPassword,
        { error: resetPasswordErrors, loading }
    ] = useMutation(mutations.resetPasswordMutation);

    const searchParams = useMemo(() => new URLSearchParams(location.search), [
        location
    ]);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const handleSubmit = useCallback(
        async ({ newPassword }) => {
            try {
                if (email && token && newPassword) {
                    await resetPassword({
                        variables: { email, token, newPassword }
                    });

                    setHasCompleted(true);
                }
            } catch (err) {
                setHasCompleted(false);
            }
        },
        [resetPassword, email, token]
    );

    return {
        email,
        formErrors: [resetPasswordErrors],
        handleSubmit,
        hasCompleted,
        loading,
        token
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for the reset password form.
 * This is a type used by the {@link useResetPassword} talon.
 *
 * @typedef {Object} ResetPasswordMutations
 *
 * @property {GraphQLAST} resetPasswordMutation mutation for resetting password
 *
 * @see [resetPassword.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql.js}
 * for the query used in Venia
 */

/**
 * Object type returned by the {@link useResetPassword} talon.
 * It provides props data to use when rendering the reset password form component.
 *
 * @typedef {Object} ResetPasswordProps
 *
 * @property {String} email email address of the user whose password is beeing reset
 * @property {Array} formErrors A list of form errors
 * @property {Function} handleSubmit Callback function to handle form submission
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {Boolean} loading True if password reset mutation is in progress. False otherwise
 * @property {String} token token needed for password reset, will be sent in the mutation
 */
