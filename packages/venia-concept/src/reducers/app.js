const initialState = {
    drawer: null,
    overlay: false,
    pending: {},
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
