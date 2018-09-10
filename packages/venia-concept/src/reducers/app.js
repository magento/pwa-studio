const initialState = {
    drawer: null,
    overlay: false,
    pending: {},
    loggedIn: false
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
            debugger;
            return {
                ...state,
                loggedIn: true
            };
        }
        case 'LOG_OUT': {
            return {
                ...state,
                loggedIn: false
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
