import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * @typedef {function} useForgotPasswordPage
 *
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 * @param {String} props.signInPageUrl - Sign In Page url
 *
 * @returns {{
 *   forgotPasswordProps: object
 * }}
 */
export const useForgotPasswordPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    // Keep location state in memory when pushing history
    const historyState = useMemo(() => {
        return history && history.location.state ? history.location.state : {};
    }, [history]);

    // Redirect if user is signed in
    useEffect(() => {
        if (isSignedIn && signedInRedirectUrl) {
            history.push(signedInRedirectUrl);
        }
    }, [history, isSignedIn, signedInRedirectUrl]);

    const handleOnCancel = useCallback(() => {
        if (signInPageUrl) {
            history.push(signInPageUrl, historyState);
        }
    }, [history, historyState, signInPageUrl]);

    const forgotPasswordProps = {
        onCancel: handleOnCancel
    };

    return {
        forgotPasswordProps
    };
};
