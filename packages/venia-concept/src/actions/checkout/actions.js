import { createActions } from 'redux-actions';

const prefix = 'CHECKOUT';
const actionTypes = ['BEGIN', 'EDIT', 'RESET'];

// classify action creators by domain
// e.g., `actions.order.submit` => CHECKOUT/ORDER/SUBMIT
// a `null` value corresponds to the default creator function
const actionMap = {
    INPUT: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    ORDER: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
