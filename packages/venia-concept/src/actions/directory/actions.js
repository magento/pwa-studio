import { createActions } from 'redux-actions';

const prefix = 'DIRECTORY';
const actionTypes = ['GET_COUNTRIES'];

export default createActions(...actionTypes, { prefix });
