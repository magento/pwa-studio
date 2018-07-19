import { combineReducers } from 'redux';

const initialState = {
    order: null,
    flow: {
        step: 'CART',
        busy: false
    },
    subflow: {
        step: 'SUMMARY',
        busy: false
    }
};

const order = (state = initialState.order, { payload, type }) => {
    switch (type) {
        case 'UPDATE_ORDER': {
            return {
                ...state,
                ...payload
            };
        }
        default: {
            return state;
        }
    }
};

const flow = (state = initialState.flow, { type }) => {
    switch (type) {
        case 'REQUEST_ORDER': {
            return {
                ...state,
                step: 'CART',
                busy: true
            };
        }
        case 'RECEIVE_ORDER': {
            return {
                ...state,
                step: 'CHECKOUT',
                busy: false
            };
        }
        case 'SUBMIT_ORDER': {
            return {
                ...state,
                step: 'CHECKOUT',
                busy: true
            };
        }
        case 'REJECT_ORDER': {
            return {
                ...state,
                step: 'CHECKOUT',
                busy: false
            };
        }
        case 'ACCEPT_ORDER': {
            return {
                ...state,
                step: 'CONFIRMATION',
                busy: false
            };
        }
        case 'RESET_CHECKOUT': {
            return {
                ...state,
                step: 'CART',
                busy: false
            };
        }
        default: {
            return state;
        }
    }
};

const subflow = (state = initialState.subflow, { payload, type }) => {
    switch (type) {
        case 'ENTER_SUBFLOW': {
            return {
                ...state,
                step: payload
            };
        }
        case 'UPDATE_ORDER': {
            return {
                ...state,
                busy: true
            };
        }
        case 'EXIT_SUBFLOW': {
            return {
                ...state,
                step: 'SUMMARY',
                busy: false
            };
        }
        default: {
            return state;
        }
    }
};

const reducer = combineReducers({
    order,
    flow,
    subflow
});

const selectCheckoutState = ({ checkout }) => ({ checkout });

export { reducer as default, selectCheckoutState };
