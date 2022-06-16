import { useState, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

export const useResetPassword = props => {
    const { mutations } = props;

    const { formatMessage } = useIntl();
    const formErrors = [];

    const [hasCompleted, setHasCompleted] = useState(false);

    const [errorPassword, setErrorPassword] = useState(false);
    const location = useLocation();
    const [resetPassword, { error: resetPasswordErrors, loading }] = useMutation(mutations.resetPasswordMutation);

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location]);
    const token = searchParams.get('token');

    const handleSubmit = useCallback(
        async ({ email, newPassword, newPasswordConfirm }) => {
            try {
                if (email && token && newPassword) {
                    if (newPasswordConfirm == newPassword) {
                        await resetPassword({
                            variables: { email, token, newPassword }
                        });

                        setHasCompleted(true);
                    } else {
                        formErrors.push(
                            new Error(
                                formatMessage({
                                    id: 'resetPassword.newPasswordConfirmError',
                                    defaultMessage: 'Las contrasenas no coinciden"'
                                })
                            )
                        );

                        setErrorPassword(true);
                    }
                }
            } catch (err) {
                formErrors.push(resetPasswordErrors);
                setHasCompleted(false);
            }
        },
        [resetPassword, token]
    );

    return {
        formErrors,
        handleSubmit,
        hasCompleted,
        errorPassword,
        loading,
        token
    };
};
