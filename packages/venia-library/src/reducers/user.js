import { handleActions } from 'redux-actions';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const storage = new BrowserPersistence();

import actions from 'src/actions/user';

export const name = 'user';

const isSignedIn = () => !!storage.getItem('signin_token');

const initialState = {
    currentUser: {
        email: '',
        firstname: '',
        lastname: ''
    },
    getDetailsError: {},
    isGettingDetails: false,
    isSignedIn: isSignedIn(),
    isSigningIn: false,
    forgotPassword: {
        email: '',
        isInProgress: false
    },
    signInError: {}
};

const reducerMap = {
    [actions.signIn.request]: state => {
        return {
            ...state,
            isSigningIn: true,
            signInError: {}
        };
    },
    [actions.signIn.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...initialState,
                signInError: payload
            };
        }

        return {
            ...state,
            isSignedIn: true,
            isSigningIn: false
        };
    },
    [actions.getDetails.request]: state => {
        return {
            ...state,
            getDetailsError: {},
            isGettingDetails: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                getDetailsError: payload,
                isGettingDetails: false
            };
        }

        return {
            ...state,
            currentUser: payload,
            isGettingDetails: false
        };
    },
    [actions.createAccountError.receive]: (state, { payload }) => {
        return {
            ...state,
            createAccountError: payload
        };
    },
    [actions.resetCreateAccountError.receive]: state => {
        return {
            ...state,
            createAccountError: {}
        };
    },
    [actions.resetPassword.request]: (state, { payload }) => {
        return {
            ...state,
            forgotPassword: {
                email: payload,
                isInProgress: true
            }
        };
    },
    // TODO: handle the reset password response from the API.
    [actions.resetPassword.receive]: state => state,
    [actions.completePasswordReset]: (state, { payload }) => {
        const { email } = payload;

        return {
            ...state,
            forgotPassword: {
                email,
                isInProgress: false
            }
        };
    },
    [actions.signIn.reset]: () => {
        return {
            ...initialState,
            isSignedIn: isSignedIn()
        };
    }
};

export default handleActions(reducerMap, initialState);
