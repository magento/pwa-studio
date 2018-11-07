import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = ['TOGGLE_DRAWER', 'TOGGLE_SEARCH', 'EXECUTE_SEARCH'];

export default createActions(...actionTypes, { prefix });
