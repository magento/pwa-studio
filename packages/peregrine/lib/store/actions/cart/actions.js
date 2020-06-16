import { createActions } from 'redux-actions';

const prefix = 'CART';

const actionMap = {
    ADD_ITEM: {
        REQUEST: null,
        RECEIVE: null
    },
    GET_CART: {
        REQUEST: null,
        RECEIVE: null
    },
    GET_DETAILS: {
        REQUEST: null,
        RECEIVE: null
    },
    REMOVE_ITEM: {
        REQUEST: null,
        RECEIVE: null
    },
    UPDATE_ITEM: {
        REQUEST: null,
        RECEIVE: null
    }
};

const actionTypes = ['BEGIN_EDIT_ITEM', 'END_EDIT_ITEM', 'RESET'];

export default createActions(actionMap, ...actionTypes, { prefix });
