const initialState = {
    isLoggedIn: false,
    loginError: {}
};

const userReducer = (state = initialState, { error, payload, type }) => {
    switch (type) {
        case 'LOG_IN': {
            return {
                ...state,
                ...payload,
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

const selectAppState = ({ user }) => ({ user });

export { userReducer as default, selectAppState };
