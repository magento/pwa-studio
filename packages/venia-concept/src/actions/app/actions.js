import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = ['TOGGLE_DRAWER', 'SET_ONLINE', 'SET_OFFLINE'];

export default createActions(...actionTypes, { prefix });
