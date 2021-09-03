import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * @typedef {function} useSignInPage
 *
 * @param {String} props.createAccountPageUrl - Create Account Password Page url
 * @param {String} props.forgotPasswordPageUrl - Forgot Password Page url
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 *
 * @returns {{
 *   handleShowCreateAccount: function,
 *   handleShowForgotPassword: function
 * }}
 */
export const useSignInPage = props => {
    const {
        createAccountPageUrl,
        forgotPasswordPageUrl,
        signedInRedirectUrl
    } = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();
    // Check if user went through AuthRoute and redirect to the `from` url instead
    const fromRedirectUrl =
        history &&
        history.location &&
        history.location.state &&
        history.location.state.from
            ? history.location.state.from
            : null;

    // Redirect if user is signed in
    useEffect(() => {
        if (isSignedIn) {
            if (fromRedirectUrl || signedInRedirectUrl) {
                history.push(fromRedirectUrl || signedInRedirectUrl);
            }
        }
    }, [history, isSignedIn, fromRedirectUrl, signedInRedirectUrl]);

    const handleShowCreateAccount = useCallback(() => {
        if (createAccountPageUrl) {
            history.push(createAccountPageUrl);
        }
    }, [createAccountPageUrl, history]);

    const handleShowForgotPassword = useCallback(() => {
        if (forgotPasswordPageUrl) {
            history.push(forgotPasswordPageUrl);
        }
    }, [forgotPasswordPageUrl, history]);

    return {
        handleShowCreateAccount,
        handleShowForgotPassword
    };
};
