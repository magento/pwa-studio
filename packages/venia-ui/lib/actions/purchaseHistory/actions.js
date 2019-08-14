import { createActions } from 'redux-actions';

const prefix = 'PURCHASE_HISTORY';
const actionTypes = ['RESET'];

const actionMap = {
    GET_PURCHASE_HISTORY: {
        REQUEST: null,
        RECEIVE: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
