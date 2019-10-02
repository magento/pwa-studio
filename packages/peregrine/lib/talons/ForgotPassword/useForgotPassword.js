import { useCallback, useState } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Returns props necessary to render a ForgotPassword form.
 * @param {function} props.onClose callback function to invoke when closing the form
 */
export const useForgotPassword = props => {
    const [{ isResettingPassword }, { resetPassword }] = useUserContext();

    const { onClose } = props;

    const [inProgress, setInProgress] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            setInProgress(true);
            setForgotPasswordEmail(email);
            await resetPassword({ email });
        },
        [resetPassword]
    );

    const handleContinue = useCallback(() => {
        setInProgress(false);
        onClose();
    }, [onClose]);

    return {
        forgotPasswordEmail,
        handleContinue,
        handleFormSubmit,
        inProgress,
        isResettingPassword
    };
};
