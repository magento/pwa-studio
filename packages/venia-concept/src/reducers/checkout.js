const initialState = {
    shippingInformation: false,
    paymentMethod: null,
    paymentTitle: null,
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
        case 'SUBMIT_SHIPPING_INFORMATION': {
            return {
                ...state,
                shippingInformation: true
            };
        }
        case 'SUBMIT_PAYMENT_INFORMATION': {
            return {
                ...state,
                paymentMethod: payload.code,
                paymentTitle: payload.title
            }
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
            return initialState;
        }
        default: {
            return state;
        }
    }
};

const selectCheckoutState = ({ checkout }) => ({ checkout });

export { reducer as default, selectCheckoutState };
