import { useCallback, useRef } from 'react';
import { useUserContext } from '../../context/user';

// Note: we can't access the actual message that comes back from the server
// without doing some fragile string manipulation. Hardcoded for now.
const ERROR_MESSAGE =
    'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.';

export const useSignIn = props => {
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const [
        { isGettingDetails, isSigningIn, signInError, getDetailsError },
        { signIn }
    ] = useUserContext();

    const hasError = !!signInError || !!getDetailsError;

    const formRef = useRef(null);
    const errorMessage = hasError ? ERROR_MESSAGE : null;

    const handleSubmit = useCallback(
        ({ email: username, password }) => {
            signIn({ username, password });
        },
        [signIn]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: form } = formRef;

        if (form) {
            setDefaultUsername(form.formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    return {
        errorMessage,
        formRef,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn
    };
};
