const initialState = {
    active: false,
    order: null,
    status: 'UNSTARTED'
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
                active: true,
                status: 'MODIFYING'
            };
        }
        case 'SUBMIT_ORDER': {
            return {
                ...state,
                active: true,
                status: 'SUBMITTING'
            };
        }
        case 'REJECT_ORDER': {
            return {
                ...state,
                active: true,
                status: 'MODIFYING'
            };
        }
        case 'ACCEPT_ORDER': {
            return {
                ...state,
                active: true,
                status: 'ACCEPTED'
            };
        }
        case 'RESET_CHECKOUT': {
            return {
                ...state,
                active: false,
                status: 'UNSTARTED'
            };
        }
        default: {
            return state;
        }
    }
};

const selectCheckoutState = ({ checkout }) => ({ checkout });

export { reducer as default, selectCheckoutState };
