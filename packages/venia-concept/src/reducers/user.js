const initialState = {
    isSignedIn: !!localStorage.getItem('signin_token'),
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
        case 'RESET_CREATE_ACCOUNT_ERROR': {
            return {
                ...state,
                createAccountError: {}
            };
        }
        case 'SIGN_IN_ERROR': {
            return {
                ...state,
                isSignedIn: false,
                signInError: payload
            };
        }
        case 'ACCOUNT_CREATE_ERROR': {
            return {
                ...state,
                createAccountError: payload
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
