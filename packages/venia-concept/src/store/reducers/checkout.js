const initialState = {
    order: null,
    status: 'READY',
    subflow: null
};

const reducer = (state = initialState, { payload, type }) => {
    switch (type) {
        case 'REQUEST_ORDER': {
            return {
                ...state,
                status: 'REQUESTING'
            };
        }
        case 'RECEIVE_ORDER': {
            return {
                ...state,
                status: 'MODIFYING'
            };
        }
        case 'ENTER_SUBFLOW': {
            return {
                ...state,
                status: 'MODIFYING',
                subflow: payload
            };
        }
        case 'EXIT_SUBFLOW': {
            return {
                ...state,
                status: 'MODIFYING',
                subflow: null
            };
        }
        case 'SUBMIT_ORDER': {
            return {
                ...state,
                status: 'SUBMITTING'
            };
        }
        case 'REJECT_ORDER': {
            return {
                ...state,
                status: 'MODIFYING'
            };
        }
        case 'ACCEPT_ORDER': {
            return {
                ...state,
                status: 'ACCEPTED'
            };
        }
        case 'RESET_CHECKOUT': {
            return {
                ...state,
                status: 'READY'
            };
        }
        case 'UPDATE_ORDER': {
            return {
                ...state,
                subflow: 'UPDATING'
            };
        }
        default: {
            return state;
        }
    }
};

const selectCheckoutState = ({ checkout }) => ({ checkout });

export { reducer as default, selectCheckoutState };
