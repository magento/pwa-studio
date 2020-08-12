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

    const token = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('token')) {
            return searchParams.get('token');
        } else {
            return null;
        }
    }, [location]);

    const email = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('email')) {
            return searchParams.get('email');
        } else {
            return null;
        }
    }, [location]);

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
                console.error(err);

                setHasCompleted(false);
            }
        },
        [resetPassword, email, token]
    );

    return {
        email,
        formErrors: [resetPasswordErrors],
        loading,
        handleSubmit,
        hasCompleted,
        token
    };
};
