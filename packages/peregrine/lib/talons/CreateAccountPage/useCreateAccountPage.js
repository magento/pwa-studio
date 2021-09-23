import { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const validCreateAccountParams = ['email', 'firstName', 'lastName'];

const getCreateAccountInitialValues = search => {
    const params = new URLSearchParams(search);

    return validCreateAccountParams.reduce(
        (values, param) => ({ ...values, [param]: params.get(param) }),
        {}
    );
};

/**
 * @typedef {function} useCreateAccountPage
 *
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 * @param {String} props.signInPageUrl - Sign In Page url
 *
 * @returns {{
 *   createAccountProps: object
 * }}
 */
export const useCreateAccountPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();
    const { search } = useLocation();

    // Keep location state in memory when pushing history and redirect to
    // the `from` url instead when creating an account
    const historyState = useMemo(() => {
        return history && history.location.state ? history.location.state : {};
    }, [history]);
    const fromRedirectUrl = historyState.from || null;

    // Redirect if user is signed in
    useEffect(() => {
        if (isSignedIn) {
            if (fromRedirectUrl || signedInRedirectUrl) {
                history.push(fromRedirectUrl || signedInRedirectUrl);
            }
        }
    }, [fromRedirectUrl, history, isSignedIn, signedInRedirectUrl]);

    const handleOnCancel = useCallback(() => {
        if (signInPageUrl) {
            history.push(signInPageUrl, historyState);
        }
    }, [history, historyState, signInPageUrl]);

    const initialValues = useMemo(() => getCreateAccountInitialValues(search), [
        search
    ]);

    const createAccountProps = {
        initialValues,
        isCancelButtonHidden: false,
        onCancel: handleOnCancel
    };

    return {
        createAccountProps
    };
};
