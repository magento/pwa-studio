import { createActions } from 'redux-actions';

const prefix = 'CHECKOUT_RECEIPT';
const actionTypes = ['SET_ORDER_INFORMATION', 'RESET'];

export default createActions(...actionTypes, { prefix });
