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
    GET_SHIPPING_METHODS: {
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
    },
    OPEN_EDIT_PANEL: {
        REQUEST: null,
        RECEIVE: null
    },
    HIDE_EDIT_PANEL: {
        REQUEST: null,
        RECEIVE: null
    }
};

export default createActions(actionMap, { prefix });
