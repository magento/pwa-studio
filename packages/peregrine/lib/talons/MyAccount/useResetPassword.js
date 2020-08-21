import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

/**
 * Returns props necessary to render a ResetPassword form.
 *
 * @param {function} props.mutations.resetPasswordMutation - mutation to call when the user submits the new password.
 *
 * @returns {{
 *  email: string,
 *  formErrors: [resetPasswordErrors],
 *  loading: boolean,
 *  handleSubmit: function,
 *  hasCompleted: boolean,
 *  token: string,
 * }}
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
