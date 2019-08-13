import { createActions } from 'redux-actions';

const prefix = 'CHECKOUT';
const actionTypes = ['BEGIN', 'EDIT', 'RESET'];

// classify action creators by domain
// e.g., `actions.order.submit` => CHECKOUT/ORDER/SUBMIT
// a `null` value corresponds to the default creator function
const actionMap = {
    BILLING_ADDRESS: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    SHIPPING_ADDRESS: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    PAYMENT_METHOD: {
        SUBMIT: null,
        ACCEPT: null,
        REJECT: null
    },
    GET_SHIPPING_METHODS: {
        REQUEST: null,
        RECEIVE: null
    },
    SHIPPING_METHOD: {
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
