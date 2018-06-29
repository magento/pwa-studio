const initialState = {
    active: false,
    order: null,
    status: 'READY'
};

const reducer = (state = initialState, { type }) => {
    switch (type) {
        case 'REQUEST_ORDER': {
            return {
                ...state,
                active: true,
                status: 'REQUESTING'
            };
        }
        case 'RECEIVE_ORDER': {
            return {
                ...state,
                status: 'MODIFYING'
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
                active: false,
                status: 'READY'
            };
        }
        default: {
            return state;
        }
    }
};

const selectCheckoutState = ({ checkout }) => ({ checkout });

export { reducer as default, selectCheckoutState };
