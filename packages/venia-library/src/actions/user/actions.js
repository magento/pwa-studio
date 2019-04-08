import { createActions } from 'redux-actions';

const prefix = 'USER';
const actionTypes = ['COMPLETE_PASSWORD_RESET'];

const actionMap = {
    SIGN_IN: {
        REQUEST: null,
        RECEIVE: null,
        RESET: null
    },
    GET_DETAILS: {
        REQUEST: null,
        RECEIVE: null
    },
    RESET_CREATE_ACCOUNT_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    CREATE_ACCOUNT_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    RESET_PASSWORD: {
        REQUEST: null,
        RECEIVE: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
