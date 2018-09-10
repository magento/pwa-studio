const initialState = {
    drawer: null,
    overlay: false,
    pending: {},
    isLoggedIn: false,
    loginError: {},
    user: {}
};

const reducer = (state = initialState, { error, payload, type }) => {
    switch (type) {
        case 'TOGGLE_DRAWER': {
            return {
                ...state,
                drawer: payload,
                overlay: !!payload
            };
        }
        case 'LOG_IN': {
            return {
                ...state,
                user: {
                    ...payload
                },
                isLoggedIn: true
            };
        }
        case 'LOG_OUT': {
            return {
                ...state,
                isLoggedIn: false
            };
        }
        case 'RESET_LOG_IN_ERROR': {
            return {
                ...state,
                loginError: {}
            };
        }
        case 'LOG_IN_ERROR': {
            return {
                ...state,
                isLoggedIn: false,
                loginError: payload
            };
        }
        default: {
            if (error) {
                return {
                    ...state,
                    error
                };
            }
            return state;
        }
    }
};

const selectAppState = ({ app }) => ({ app });

export { reducer as default, selectAppState };
