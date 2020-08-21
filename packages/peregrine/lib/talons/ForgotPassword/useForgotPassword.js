import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

/**
 * Returns props necessary to render a ForgotPassword form.
 *
 * @param {function} props.onCancel - callback function to call when user clicks the cancel button
 * @param {function} props.mutations.requestPasswordResetEmailMutation - mutation to call when the user clicks the submit button to request the reset email
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
    const { onCancel, mutations } = props;

    const [inProgress, setInProgress] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const [
        requestResetEmail,
        { error: requestResetEmailError, loading: isResettingPassword }
    ] = useMutation(mutations.requestPasswordResetEmailMutation);

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            setForgotPasswordEmail(email);
            await requestResetEmail({ variables: { email } });
        },
        [requestResetEmail]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        formErrors: [requestResetEmailError],
        forgotPasswordEmail,
        handleCancel,
        handleFormSubmit,
        inProgress,
        isResettingPassword
    };
};
