import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render a ForgotPassword form.
 * @param {function} props.onClose callback function to invoke when closing the form
 */
export const useForgotPassword = props => {
    const [{ isResettingPassword }] = useUserContext();

    const { onClose, onCancel, mutations } = props;

    const [inProgress, setInProgress] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const [resetPassword] = useMutation(mutations.resetPasswordMutation, {
        onError: () => {}
    });

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            setForgotPasswordEmail(email);
            await resetPassword({ variables: { email } });
        },
        [resetPassword]
    );

    const handleContinue = useCallback(() => {
        setInProgress(false);
        onClose();
    }, [onClose]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        forgotPasswordEmail,
        handleContinue,
        handleFormSubmit,
        handleCancel,
        inProgress,
        isResettingPassword
    };
};
