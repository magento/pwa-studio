import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = ['TOGGLE_DRAWER'];

export default createActions(...actionTypes, { prefix });
