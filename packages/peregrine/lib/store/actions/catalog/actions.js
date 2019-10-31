import { createActions } from 'redux-actions';

const prefix = 'CATALOG';
const actionTypes = ['UPDATE_CATEGORIES'];

const actionMap = {
    SET_CURRENT_PAGE: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_PREV_PAGE_TOTAL: {
        REQUEST: null,
        RECEIVE: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
