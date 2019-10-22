import { handleActions } from 'redux-actions';

import { Util } from '../../index';
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
    getDetailsError: null,
    isGettingDetails: false,
    isResettingPassword: false,
    isSignedIn: isSignedIn(),
    isSigningIn: false,
    resetPasswordError: null,
    signInError: null
};

const reducerMap = {
    [actions.signIn.request]: state => {
        return {
            ...state,
            isSigningIn: true,
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
            isSigningIn: false,
            signInError: null
        };
    },
    [actions.getDetails.request]: state => {
        return {
            ...state,
            getDetailsError: null,
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
            getDetailsError: null,
            isGettingDetails: false
        };
    },
    [actions.resetPassword.request]: state => ({
        ...state,
        isResettingPassword: true
    }),
    // TODO: handle the reset password response from the API.
    [actions.resetPassword.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                isResettingPassword: false,
                resetPasswordError: payload
            };
        }

        return {
            ...state,
            isResettingPassword: false,
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
