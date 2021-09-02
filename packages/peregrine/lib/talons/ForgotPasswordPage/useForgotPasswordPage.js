import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * @typedef {function} useForgotPasswordPage
 *
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 * @param {String} props.signInPageUrl - Sign In Page url
 *
 * @returns {{
 *   handleOnCancel: function
 * }}
 */
export const useForgotPasswordPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    // Redirect if user is signed in
    useEffect(() => {
        if (isSignedIn && signedInRedirectUrl) {
            history.push(signedInRedirectUrl);
        }
    }, [history, isSignedIn, signedInRedirectUrl]);

    const handleOnCancel = useCallback(() => {
        if (signInPageUrl) {
            history.push(signInPageUrl);
        }
    }, [history, signInPageUrl]);

    return {
        handleOnCancel
    };
};
