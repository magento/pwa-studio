import { useCallback, useRef, useState } from 'react';
import { useUserContext } from '../../context/user';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '../../context/cart';

export const useSignIn = props => {
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signInMutation
    } = props;

    const [isSigningIn, setIsSigningIn] = useState(false);

    const [, { getCartDetails, removeCart }] = useCartContext();
    const [, { setToken }] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation);

    const errors = [];
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }

    const formRef = useRef(null);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            try {
                // Sign in and save the token
                const response = await signIn({
                    variables: { email, password }
                });

                const token =
                    response && response.data.generateCustomerToken.token;

                await setToken(token);
                await removeCart();
                await getCartDetails({ forceRefresh: true });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [getCartDetails, removeCart, setToken, signIn]
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
        errors,
        formRef,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isSigningIn
    };
};
