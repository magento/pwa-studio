import { handleActions } from 'redux-actions';

import authorizationService from 'src/services/authorization';

import actions from 'src/actions/user';

export const name = 'user';

const initialState = {
    isSignedIn: authorizationService.isSignedIn(),
    currentUser: {
        email: '',
        firstname: '',
        lastname: ''
    },
    signInError: {}
};

const reducerMap = {
    [actions.signIn.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            ...payload,
            isSignedIn: true,
            currentUser: Object.assign(payload)
        };
    },
    [actions.signInError.receive]: (state, { payload }) => {
        return {
            ...state,
            isSignedIn: false,
            signInError: payload
        };
    },
    [actions.createAccountError.receive]: (state, { payload }) => {
        return {
            ...state,
            createAccountError: payload
        };
    },
    [actions.resetSignInError.receive]: state => {
        return {
            ...state,
            signInError: {}
        };
    },
    [actions.resetCreateAccountError.receive]: state => {
        return {
            ...state,
            createAccountError: {}
        };
    }
};

export default handleActions(reducerMap, initialState);
