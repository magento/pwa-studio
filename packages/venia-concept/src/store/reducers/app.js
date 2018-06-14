const initialState = {
    drawer: null,
    overlay: false
};

const reducer = (state = initialState, { payload, type }) => {
    switch (type) {
        case 'TOGGLE_DRAWER': {
            return {
                ...state,
                drawer: payload,
                overlay: !!payload
            };
        }
        default: {
            return state;
        }
    }
};

const selectAppState = ({ app }) => ({ app: app || initialState });

export { reducer as default, selectAppState };
