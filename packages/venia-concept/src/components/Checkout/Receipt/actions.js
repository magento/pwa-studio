import { createActions } from 'redux-actions';

const prefix = 'checkoutReceipt';
const actionTypes = ['SET_ORDER_INFORMATION', 'RESET'];

export default createActions(...actionTypes, { prefix });
