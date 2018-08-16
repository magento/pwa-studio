import { createActions } from 'redux-actions';

const prefix = 'CART';
const actionTypes = [
    'ADD_ITEM',
    'REQUEST_GUEST_CART',
    'RECEIVE_GUEST_CART',
    'REQUEST_DETAILS',
    'UPDATE_DETAILS'
];

export default createActions(...actionTypes, { prefix });
