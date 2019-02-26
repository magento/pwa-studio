import { createActions } from 'redux-actions';

const prefix = 'CART';

const actionMap = {
    ADD_ITEM: {
        REQUEST: null,
        RECEIVE: null
    },
    GET_GUEST_CART: {
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

const actionTypes = ['OPEN_OPTIONS_DRAWER', 'CLOSE_OPTIONS_DRAWER'];

export default createActions(actionMap, ...actionTypes, { prefix });
