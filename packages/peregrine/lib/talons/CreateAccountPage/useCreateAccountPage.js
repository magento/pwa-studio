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
 * @param {String} props.createAccountRedirectUrl - Url to push when user creates an account
 * @param {String} props.signedInRedirectUrl - Url to push when user is signed in
 * @param {String} props.signInPageUrl - Sign In Page url
 *
 * @returns {{
 *   handleCreateAccount: function,
 *   handleOnCancel: function,
 *   initialValues: object
 * }}
 */
export const useCreateAccountPage = props => {
    const {
        createAccountRedirectUrl,
        signedInRedirectUrl,
        signInPageUrl
    } = props;
    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();
    const { search } = useLocation();

    // Redirect if user is signed in
    useEffect(() => {
        if (isSignedIn && signedInRedirectUrl) {
            history.push(signedInRedirectUrl);
        }
    }, [history, isSignedIn, signedInRedirectUrl]);

    const handleCreateAccount = useCallback(() => {
        if (createAccountRedirectUrl) {
            history.push(createAccountRedirectUrl);
        }
    }, [createAccountRedirectUrl, history]);

    const handleOnCancel = useCallback(() => {
        if (signInPageUrl) {
            history.push(signInPageUrl);
        }
    }, [history, signInPageUrl]);

    const initialValues = useMemo(() => getCreateAccountInitialValues(search), [
        search
    ]);

    return {
        handleCreateAccount,
        handleOnCancel,
        initialValues
    };
};
