import { handleActions } from 'redux-actions';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const storage = new BrowserPersistence();

import actions from '../actions/user';

export const name = 'user';

const isSignedIn = () => !!storage.getItem('signin_token');

const initialState = {
    currentUser: {
        email: '',
        firstname: '',
        lastname: ''
    },
    createAccountError: null,
    getDetailsError: null,
    isSignedIn: isSignedIn(),
    resetPasswordError: null,
    signInError: null
};

const reducerMap = {
    [actions.signIn.request]: state => {
        return {
            ...state,
            signInError: null
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
            signInError: null
        };
    },
    [actions.getDetails.request]: state => {
        return {
            ...state,
            getDetailsError: null
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                getDetailsError: payload
            };
        }

        return {
            ...state,
            currentUser: payload,
            getDetailsError: null
        };
    },
    [actions.createAccount.request]: state => {
        return {
            ...state,
            createAccountError: null
        };
    },
    [actions.createAccount.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                createAccountError: payload
            };
        }

        return {
            ...state,
            createAccountError: null
        };
    },
    [actions.resetPassword.request]: state => state,
    // TODO: handle the reset password response from the API.
    [actions.resetPassword.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                resetPasswordError: payload
            };
        }

        return {
            ...state,
            resetPasswordError: null
        };
    },
    [actions.reset]: () => {
        return {
            ...initialState,
            isSignedIn: isSignedIn()
        };
    }
};

export default handleActions(reducerMap, initialState);
