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
    },
    FILTER_OPTION: {
        SET_TO_APPLIED: null,
        UPDATE: null,
        CLEAR: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
