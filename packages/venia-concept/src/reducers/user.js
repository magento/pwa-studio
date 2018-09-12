const initialState = {
    isSignedIn: false,
    signInError: {}
};

const userReducer = (state = initialState, { error, payload, type }) => {
    switch (type) {
        case 'SIGN_IN': {
            return {
                ...state,
                ...payload,
                isSignedIn: true
            };
        }
        case 'SIGN_OUT': {
            return {
                ...state,
                isSignedIn: false
            };
        }
        case 'RESET_SIGN_IN_ERROR': {
            return {
                ...state,
                signInError: {}
            };
        }
        case 'SIGN_IN_ERROR': {
            return {
                ...state,
                isSignedIn: false,
                signInError: payload
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
