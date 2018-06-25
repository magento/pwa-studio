const initialState = {
    active: false,
    order: null,
    status: 'UNSTARTED'
};

const reducer = (state = initialState, { type }) => {
    switch (type) {
        case 'ENTER_CHECKOUT': {
            return {
                ...state,
                active: true,
                status: 'MODIFYING'
            };
        }
        case 'EXIT_CHECKOUT': {
            return {
                ...state,
                status: 'SUBMITTING'
            };
        }
        case 'RESUME_CHECKOUT': {
            return {
                ...state,
                status: 'MODIFYING'
            };
        }
        case 'COMPLETE_CHECKOUT': {
            return {
                ...state,
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
