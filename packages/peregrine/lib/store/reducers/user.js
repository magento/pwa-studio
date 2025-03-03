import { handleActions } from 'redux-actions';
import BrowserPersistence from '../../util/simplePersistence';

const storage = new BrowserPersistence();

import actions from '../actions/user';

export const name = 'user';

const rawSignInToken = storage.getRawItem('signin_token');

const isSignedIn = () => !!rawSignInToken;

const getToken = () => {
    if (!rawSignInToken) {
        return undefined;
    }
    const { value } = JSON.parse(rawSignInToken);
    return value;
};

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
    resetPasswordError: null,
    token: getToken(),
    userOnOrderSuccess: false // Add userOnOrderSuccess state
};

const reducerMap = {
    [actions.setToken]: (state, { payload }) => {
        return {
            ...state,
            isSignedIn: true,
            token: payload
        };
    },
    [actions.clearToken]: state => {
        return {
            ...state,
            isSignedIn: false,
            token: null
        };
    },
    [actions.setUserOnOrderSuccess]: (state, { payload }) => {
        return {
            ...state,
            userOnOrderSuccess: payload // Update the state with the new flag value
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
            isSignedIn: false,
            token: null
        };
    }
};

export default handleActions(reducerMap, initialState);
