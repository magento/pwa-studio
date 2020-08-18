import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render a ForgotPassword form.
 *
 * @param {function} props.onCancel - callback function to call when user clicks the cancel button
 * @param {function} props.mutations.resetPasswordMutation - mutation to call when the user clicks the submit button
 *
 * @returns {{
 *  formErrors: [Error],
 *  forgotPasswordEmail: string,
 *  inProgress: boolean,
 *  isResettingPassword: boolean,
 *  handleCancel: function,
 *  handleFormSubmit: function,
 * }}
 */
export const useForgotPassword = props => {
    const [{ isResettingPassword }] = useUserContext();

    const { onCancel, mutations } = props;

    const [inProgress, setInProgress] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const [resetPassword, { error: resetPasswordError }] = useMutation(
        mutations.resetPasswordMutation
    );

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            setForgotPasswordEmail(email);
            await resetPassword({ variables: { email } });
        },
        [resetPassword]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        formErrors: [resetPasswordError],
        inProgress,
        isResettingPassword,
        forgotPasswordEmail,
        handleCancel,
        handleFormSubmit
    };
};
