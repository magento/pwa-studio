import { createActions } from 'redux-actions';

const prefix = 'PURCHASE_HISTORY';
const actionTypes = ['SET_ITEMS', 'RESET', 'FETCH_PURCHASE_HISTORY_REQUEST'];

export default createActions(...actionTypes, { prefix });
